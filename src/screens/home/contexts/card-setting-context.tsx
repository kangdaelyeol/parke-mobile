import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { StyleProp, useWindowDimensions, ViewStyle } from 'react-native'
import {
  Easing,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { runOnJS } from 'react-native-worklets'

/**
 * 카드 → 수정 화면 전환은 진행값 하나(settingProgress, 0~1)로 연출한다.
 * 각 요소는 이 값의 구간을 나눠 써서 차례로 움직이고, 닫을 때는 같은 타임라인을 거꾸로 재생한다.
 *
 *   0 ──── 0.15 ──── 0.3 ──── 0.45 ──── 0.6 ──── 0.9
 *   카드/현황/점 ██████ 제자리에서 사라짐
 *   푸터→버튼 바      ████████
 *   배경                 ██████
 *   폼 항목                    ██ ██ ██ ██ (미리보기부터 위에서 차례로)
 */
export const SETTING_RANGE = {
  homeFade: [0, 0.3],
  cardFade: [0, 0.3],
  backdrop: [0.2, 0.45],
  footer: [0.15, 0.45],
  // 폼 항목(0번: 미리보기)이 이 간격으로 차례로 나타난다
  staggerStart: 0.3,
  staggerStep: 0.04,
  staggerLength: 0.25,
} as const

const OPEN_DURATION_MS = 900
const CLOSE_DURATION_MS = 600

// 진행값 자체는 일정한 속도로 흐르고, 감속/가속은 각 구간 안에서만 준다.
// (전체에 곡선을 걸면 앞 구간이 몇 분의 1초로 압축된다)
export const settingSegment = (
  progress: number,
  range: readonly [number, number],
) => {
  'worklet'
  const t = Math.min(
    1,
    Math.max(0, (progress - range[0]) / (range[1] - range[0])),
  )
  // ease-in-out cubic
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

interface CardSettingContext {
  sliderStyle: StyleProp<ViewStyle>
  // 오늘의 현황, 페이지 점처럼 수정 모드에서 먼저 사라지는 요소
  homeContentStyle: StyleProp<ViewStyle>
  settingProgress: SharedValue<number>
  cardSettingController: {
    showSetting: (_: number) => void
    hideSetting: () => void
  }
  // 수정 중인 카드 (닫는 애니메이션이 끝날 때까지 유지된다)
  settingCard: number
  // 여는 애니메이션이 끝났는지. 무거운 요소(웹뷰)는 이때 만든다
  settingOpened: boolean
  setSettingCard: React.Dispatch<React.SetStateAction<number>>
}

const cardSettingContext = createContext<CardSettingContext>(
  {} as CardSettingContext,
)

export const CardSettingProvider = ({ children }: PropsWithChildren) => {
  const { width } = useWindowDimensions()
  const isSmall = width < 400
  const sliderMargin = isSmall ? 250 : 300

  const settingProgress = useSharedValue(0)
  const [settingCard, setSettingCard] = useState(-1)
  const [settingOpened, setSettingOpened] = useState(false)

  const cardSettingController = {
    showSetting: (idx: number) => {
      setSettingCard(idx)
      // 수정 화면을 처음 그리는 프레임과 애니메이션 첫 프레임이 겹치지 않도록 한 프레임 뒤에 시작
      requestAnimationFrame(() => {
        settingProgress.value = withTiming(
          1,
          { duration: OPEN_DURATION_MS, easing: Easing.linear },
          finished => {
            if (finished) runOnJS(setSettingOpened)(true)
          },
        )
      })
    },
    // 거꾸로 재생이 끝난 뒤에 수정 화면을 내린다 (중간에 다시 열면 내리지 않는다)
    hideSetting: () => {
      settingProgress.value = withTiming(
        0,
        { duration: CLOSE_DURATION_MS, easing: Easing.linear },
        finished => {
          if (!finished) return
          runOnJS(setSettingCard)(-1)
          runOnJS(setSettingOpened)(false)
        },
      )
    },
  }

  const sliderStyle = useAnimatedStyle(() => {
    const p = settingProgress.value
    return {
      // 카드는 움직이지 않고 제자리에서 사라진다
      marginVertical: sliderMargin,
      opacity: interpolate(
        settingSegment(p, SETTING_RANGE.cardFade),
        [0, 1],
        [1, 0],
      ),
    }
  })

  const homeContentStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      settingSegment(settingProgress.value, SETTING_RANGE.homeFade),
      [0, 1],
      [1, 0],
    ),
  }))

  return (
    <cardSettingContext.Provider
      value={{
        cardSettingController,
        settingCard,
        settingOpened,
        setSettingCard,
        sliderStyle,
        homeContentStyle,
        settingProgress,
      }}
    >
      {children}
    </cardSettingContext.Provider>
  )
}

export const useCardSettingContext = () => useContext(cardSettingContext)

// 수정 화면의 index번째 요소가 차례로 나타나는 스타일 (0번: 미리보기)
export const useSettingStaggerStyle = (index: number, fromY = 16) => {
  const { settingProgress } = useCardSettingContext()
  return useAnimatedStyle(() => {
    const start = SETTING_RANGE.staggerStart + index * SETTING_RANGE.staggerStep
    const range = [start, start + SETTING_RANGE.staggerLength] as const
    const p = settingProgress.value
    return {
      opacity: interpolate(settingSegment(p, range), [0, 1], [0, 1]),
      transform: [
        {
          translateY: interpolate(settingSegment(p, range), [0, 1], [fromY, 0]),
        },
      ],
    }
  })
}
