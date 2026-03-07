import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useCardSettingContext, useCardSliderContext } from '@/contexts'
import { HomeCardViewModel } from '@home/types'
import { useEffect } from 'react'

export const useHomeCardViewModel = (idx: number): HomeCardViewModel => {
  const { settingCard } = useCardSettingContext()
  const { selectedCardIdx, sliderController } = useCardSliderContext()
  const isSelected = idx === selectedCardIdx

  const cardOpacity = useSharedValue(isSelected ? 1 : 0)
  const cardTranslateY = useSharedValue(isSelected ? 1 : 0)

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

  const cardPress = () => {
    if (settingCard !== -1) return

    if (!isSelected) sliderController.goToIdx(idx)
  }

  return {
    state: {},
    animated: { cardStyle },
    actions: { cardPress },
  }
}
