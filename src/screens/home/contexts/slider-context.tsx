import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { Gesture, PanGesture } from 'react-native-gesture-handler'
import { runOnJS } from 'react-native-worklets'
import { SLIDER_GAP } from '@home/constants'
import { useCardSize } from '@home/hooks'
import { useUserContext } from '@/contexts'
import { useCardSettingContext } from './card-setting-context'
import { resistEdges, snapIndex } from './slider-math'
import { useThemed } from '@/theme/themed'
import type { ThemeId } from '@/theme/themes'

/**
 * 카드 슬라이더: 카드들 + 맨 끝 카드 추가 칸을 가로로 넘긴다.
 * 위치는 translateX 하나로만 움직이고, 선택한 칸(selectedCardIdx)은 손을 뗀 뒤에 정해진다.
 */
// 가로로 이만큼 움직여야 넘기기가 시작된다. 그 전에 손을 떼면 카드 터치로 처리된다
const ACTIVE_OFFSET = 10
// 글래스 홈은 세로로 스크롤된다. 가로보다 세로로 먼저 이만큼 움직이면 넘기기를 그만두고 스크롤에 넘긴다
const SCROLL_FAIL_OFFSET = 14
// 테마별로 홈 본문이 세로로 스크롤되는지 (글래스: 상단 바부터 카드 정보 판까지 함께 스크롤)
const HOME_SCROLLS: Record<ThemeId, boolean> = {
  classic: false,
  'glass-dashboard': true,
}
const SNAP = { duration: 300, easing: Easing.out(Easing.cubic) }

interface SliderController {
  goToIdx: (idx: number) => void
}

interface SliderContextValue {
  panGesture: PanGesture
  moverStyle: StyleProp<ViewStyle>
  sliderController: SliderController
  selectedCardIdx: number
  // 넘기는 중이거나 막 넘긴 직후인지. 카드 안의 버튼은 이때 누름을 무시한다
  // (손을 뗄 때 넘기기와 카드 누름이 함께 일어나는 것을 막는다)
  isSliding: () => boolean
}

// 넘기기가 끝난 뒤에도 이 시간 동안은 누름을 무시한다
const PRESS_BLOCK_MS = 250

const sliderContext = createContext({} as SliderContextValue)

export const SliderContextProvider = ({ children }: PropsWithChildren) => {
  const { cards } = useUserContext()
  const { isSetting } = useCardSettingContext()
  const scrollable = useThemed(HOME_SCROLLS)
  // 마지막 칸은 카드 추가(EmptyCard)
  const lastIdx = cards?.length ?? 0

  const [selectedCardIdx, setSelectedCard] = useState(0)
  const translateX = useSharedValue(0)
  const dragStartX = useSharedValue(0)
  // 칸 사이 간격 = 카드 폭 + 틈 (글래스는 카드 폭이 화면에 따라 달라진다)
  const { width: cardWidth } = useCardSize()
  const interval = cardWidth + SLIDER_GAP

  const slidingRef = useRef(false)
  const slideEndAtRef = useRef(0)
  const markSlideStart = useCallback(() => {
    slidingRef.current = true
  }, [])
  // 실제로 넘기기가 시작된 경우에만 끝난 시각을 남긴다 (그냥 탭은 막지 않는다)
  const markSlideEnd = useCallback(() => {
    if (!slidingRef.current) return
    slidingRef.current = false
    slideEndAtRef.current = Date.now()
  }, [])
  const isSliding = useCallback(
    () =>
      slidingRef.current || Date.now() - slideEndAtRef.current < PRESS_BLOCK_MS,
    [],
  )

  const goToIdx = useCallback(
    (idx: number) => {
      translateX.value = withTiming(-idx * interval, SNAP)
      setSelectedCard(idx)
    },
    [translateX, interval],
  )

  // 테마를 바꿔 카드 폭이 달라지면 지금 칸 위치로 바로 맞춘다
  useEffect(() => {
    translateX.value = -selectedCardIdx * interval
    // 칸을 고를 때는 goToIdx가 옮기므로 폭이 바뀔 때만 다시 맞춘다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interval, translateX])

  // 카드가 줄어 선택한 칸이 없어지면 마지막 칸으로 옮긴다
  useEffect(() => {
    if (selectedCardIdx > lastIdx) goToIdx(lastIdx)
  }, [selectedCardIdx, lastIdx, goToIdx])

  // 수정 화면에서는 넘기지 않는다
  const panGesture = useMemo(() => {
    const pan = Gesture.Pan()
      .enabled(!isSetting)
      .activeOffsetX([-ACTIVE_OFFSET, ACTIVE_OFFSET])
    if (scrollable) pan.failOffsetY([-SCROLL_FAIL_OFFSET, SCROLL_FAIL_OFFSET])
    return pan
      .onStart(() => {
        runOnJS(markSlideStart)()
        cancelAnimation(translateX)
        dragStartX.value = translateX.value
      })
      .onUpdate(e => {
        translateX.value = resistEdges(
          dragStartX.value + e.translationX,
          -lastIdx * interval,
        )
      })
      .onEnd(e => {
        const target = snapIndex(
          -translateX.value / interval,
          e.velocityX,
          lastIdx,
        )
        translateX.value = withTiming(-target * interval, SNAP)
        runOnJS(setSelectedCard)(target)
      })
      .onFinalize(() => {
        runOnJS(markSlideEnd)()
      })
  }, [
    isSetting,
    scrollable,
    lastIdx,
    interval,
    translateX,
    dragStartX,
    markSlideStart,
    markSlideEnd,
  ])

  const moverStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  const sliderController = useMemo(() => ({ goToIdx }), [goToIdx])

  // 값이 그대로면 같은 객체를 넘겨, 쓰는 쪽이 괜히 다시 그려지지 않게 한다
  const value = useMemo(
    () => ({
      selectedCardIdx,
      isSliding,
      panGesture,
      moverStyle,
      sliderController,
    }),
    [selectedCardIdx, isSliding, panGesture, moverStyle, sliderController],
  )

  return (
    <sliderContext.Provider value={value}>{children}</sliderContext.Provider>
  )
}

export const useCardSliderContext = () => useContext(sliderContext)
