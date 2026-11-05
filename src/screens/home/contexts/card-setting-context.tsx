import {
  createContext,
  useEffect,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react'
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
import { CARD_HEIGHT } from '@home/constants'
import { useTabBarLayout } from '@/hooks'
import { useThemeId } from '@/theme/themed'

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

// 카드 상세(드롭다운): 카드 아래로 패널이 펼쳐지고, 화면 아래가 모자라면 카드가 그만큼 올라간다
const DETAIL_OPEN_MS = 480
const DETAIL_CLOSE_MS = 340
const DETAIL_EASING = Easing.bezier(0.22, 1, 0.36, 1)
// 카드와 패널 사이 간격, 패널과 탭바 사이 여백, 카드가 올라가도 남길 위 여백
export const DETAIL_GAP = 6
const DETAIL_BOTTOM_SPACE = 16
const DETAIL_TOP_SPACE = 12

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
  // 상세가 열린 카드 (닫는 애니메이션이 끝날 때까지 유지된다, 없으면 -1)
  detailCard: number
  // 0: 닫힘 ~ 1: 열림
  detailProgress: SharedValue<number>
  detailController: {
    // panelHeight: 펼쳐질 패널 높이 (카드를 얼마나 올릴지 계산에 쓴다)
    open: (idx: number, panelHeight: number) => void
    close: (onClosed?: () => void) => void
    // 애니메이션 없이 바로 닫기 (카드 삭제 등)
    reset: () => void
  }
  // 카드 영역 높이 (Main의 onLayout)
  setMainHeight: (height: number) => void
}

const cardSettingContext = createContext<CardSettingContext>(
  {} as CardSettingContext,
)

export const CardSettingProvider = ({ children }: PropsWithChildren) => {
  const { width } = useWindowDimensions()
  const isSmall = width < 400
  const sliderMargin = isSmall ? 250 : 300
  // 카드 영역 아래를 덮는 탭바 몫
  const { space: footerSpace } = useTabBarLayout()

  const settingProgress = useSharedValue(0)
  const detailProgress = useSharedValue(0)
  const detailLift = useSharedValue(0)
  const [detailCard, setDetailCard] = useState(-1)

  // 테마를 바꾸면 열려 있던 카드 상세를 닫는다 (기본 테마 카드에는 상세가 없어 닫을 수 없다)
  const themeId = useThemeId()
  useEffect(() => {
    detailProgress.value = 0
    setDetailCard(-1)
  }, [themeId, detailProgress])
  const [mainHeight, setMainHeight] = useState(0)

  // 슬라이더 제스처가 close를 잡아 두므로 매 렌더마다 새로 만들지 않는다
  const detailController = useMemo(
    () => ({
      open: (idx: number, panelHeight: number) => {
        // 카드 아래 남은 공간(탭바 위까지)에 패널이 다 들어가지 않으면 모자란 만큼 올린다
        const overflow =
          sliderMargin +
          CARD_HEIGHT +
          DETAIL_GAP +
          panelHeight +
          footerSpace +
          DETAIL_BOTTOM_SPACE -
          mainHeight
        detailLift.value = Math.max(
          0,
          Math.min(overflow, sliderMargin - DETAIL_TOP_SPACE),
        )
        setDetailCard(idx)
        detailProgress.value = withTiming(1, {
          duration: DETAIL_OPEN_MS,
          easing: DETAIL_EASING,
        })
      },
      close: (onClosed?: () => void) => {
        const finish = () => {
          setDetailCard(-1)
          onClosed?.()
        }
        detailProgress.value = withTiming(
          0,
          { duration: DETAIL_CLOSE_MS, easing: DETAIL_EASING },
          finished => {
            if (finished) runOnJS(finish)()
          },
        )
      },
      reset: () => {
        detailProgress.value = 0
        setDetailCard(-1)
      },
    }),
    [sliderMargin, mainHeight, footerSpace, detailLift, detailProgress],
  )
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

  // 위아래 여백은 변하지 않으므로 애니메이션 스타일에 넣지 않는다
  // (레이아웃 속성이 섞이면 매 프레임 그 값까지 다시 반영한다)
  const sliderMarginStyle = useMemo(
    () => ({ marginVertical: sliderMargin }),
    [sliderMargin],
  )
  const sliderMotionStyle = useAnimatedStyle(() => {
    const p = settingProgress.value
    return {
      // 상세가 열리면 패널이 들어갈 만큼 올라간다
      transform: [{ translateY: -detailProgress.value * detailLift.value }],
      // 카드는 움직이지 않고 제자리에서 사라진다
      opacity: interpolate(
        settingSegment(p, SETTING_RANGE.cardFade),
        [0, 1],
        [1, 0],
      ),
    }
  })
  const sliderStyle = [sliderMarginStyle, sliderMotionStyle]

  // 수정 화면이 열리거나 카드 상세가 열리면 사라진다
  const homeContentStyle = useAnimatedStyle(() => ({
    opacity:
      interpolate(
        settingSegment(settingProgress.value, SETTING_RANGE.homeFade),
        [0, 1],
        [1, 0],
      ) * interpolate(detailProgress.value, [0, 0.6], [1, 0], 'clamp'),
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
        detailCard,
        detailProgress,
        detailController,
        setMainHeight,
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
