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
  clamp,
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
import { useCardSettingContext } from '@home/contexts'

/**
 * 카드 슬라이더: 카드들 + 맨 끝 카드 추가 칸을 가로로 넘긴다.
 * 위치는 translateX 하나로만 움직이고, 선택한 칸(selectedCardIdx)은 손을 뗀 뒤에 정해진다.
 */
// 가로로 이만큼 움직여야 넘기기가 시작된다. 그 전에 손을 떼면 카드 터치로 처리된다
const ACTIVE_OFFSET = 10
// 이보다 빠르게 밀면 거리가 짧아도 민 방향으로 한 칸 넘긴다
const FLING_VELOCITY = 500
// 처음/마지막 칸에서 더 밀면 손가락을 이 비율만큼만 따라간다
const EDGE_RESISTANCE = 0.3
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
  const { settingCard, detailCard, detailProgress, detailController } =
    useCardSettingContext()
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
      // 다른 카드로 옮기면 열려 있던 상세는 접는다
      if (detailCard !== -1 && detailCard !== idx) detailController.close()
      translateX.value = withTiming(-idx * interval, SNAP)
      setSelectedCard(idx)
    },
    [detailCard, detailController, translateX, interval],
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

  const closeDetail = detailController.close

  // 수정 화면에서는 넘기지 않는다. 상세가 열려 있으면 넘기기 시작할 때 접는다
  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(settingCard === -1)
        .activeOffsetX([-ACTIVE_OFFSET, ACTIVE_OFFSET])
        .onStart(() => {
          runOnJS(markSlideStart)()
          cancelAnimation(translateX)
          dragStartX.value = translateX.value
          if (detailProgress.value > 0) runOnJS(closeDetail)()
        })
        .onUpdate(e => {
          const minX = -lastIdx * interval
          const x = dragStartX.value + e.translationX
          if (x > 0) translateX.value = x * EDGE_RESISTANCE
          else if (x < minX)
            translateX.value = minX + (x - minX) * EDGE_RESISTANCE
          else translateX.value = x
        })
        .onEnd(e => {
          const position = -translateX.value / interval
          let target = Math.round(position)
          // 빠르게 밀었으면 지금 위치에서 민 방향의 칸으로
          if (e.velocityX < -FLING_VELOCITY) target = Math.ceil(position)
          else if (e.velocityX > FLING_VELOCITY) target = Math.floor(position)
          target = clamp(target, 0, lastIdx)

          translateX.value = withTiming(-target * interval, SNAP)
          runOnJS(setSelectedCard)(target)
        })
        .onFinalize(() => {
          runOnJS(markSlideEnd)()
        }),
    [
      settingCard,
      lastIdx,
      interval,
      closeDetail,
      detailProgress,
      translateX,
      dragStartX,
      markSlideStart,
      markSlideEnd,
    ],
  )

  const moverStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  const sliderController = useMemo(() => ({ goToIdx }), [goToIdx])

  return (
    <sliderContext.Provider
      value={{
        selectedCardIdx,
        isSliding,
        panGesture,
        moverStyle,
        sliderController,
      }}
    >
      {children}
    </sliderContext.Provider>
  )
}

export const useCardSliderContext = () => useContext(sliderContext)
