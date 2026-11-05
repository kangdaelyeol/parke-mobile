import { useEffect, useRef } from 'react'
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useCardActions } from './use-card-actions'
import { HomeCardViewModel } from '@home/types'

// 슬라이더 안의 카드: 카드 기능 + 선택 여부에 따른 모양 + 자동감지 점
export const useCardViewModel = (idx: number): HomeCardViewModel => {
  const { loading, isSetting, isSelected, actions } = useCardActions(idx)
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const cardOpacity = useSharedValue(isSelected ? 1 : 0)
  const cardTranslateY = useSharedValue(isSelected ? 1 : 0)

  const scanOnDotOpacity = useSharedValue(1)

  useEffect(() => {
    scanOnDotOpacity.value = withRepeat(
      withTiming(0, { duration: 1000, easing: Easing.out(Easing.ease) }),
      -1,
      true,
    )
  }, [scanOnDotOpacity])

  const scanOnDotStyle = useAnimatedStyle(() => ({
    opacity: scanOnDotOpacity.value * 0.6 + 0.4,
  }))

  useEffect(() => {
    cardOpacity.value = withTiming(isSelected ? 1 : 0, { duration: 200 })
    cardTranslateY.value = withTiming(isSelected ? 1 : 0, {
      duration: 150,
      easing: Easing.out(Easing.cubic),
    })
  }, [cardOpacity, cardTranslateY, isSelected])

  const cardStyle = useAnimatedStyle(() => {
    return {
      opacity: 0.4 + 0.6 * cardOpacity.value,
      transform: [
        {
          translateY: (1 - cardTranslateY.value) * 15,
        },
      ],
    }
  })

  return {
    state: {
      loading,
      isSetting,
      bottomSheetModalRef,
    },
    animated: { cardStyle, scanOnDotStyle },
    actions: {
      ...actions,
      morePress: () => {
        bottomSheetModalRef.current?.present()
      },
    },
  }
}
