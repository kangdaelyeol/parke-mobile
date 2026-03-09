import {
  useCardSettingContext,
  useCardSliderContext,
  useUserContext,
} from '@/contexts'
import { HomeMainViewModel } from '@home/types'
import { useEffect } from 'react'
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'

export const useHomeMainViewModel = (): HomeMainViewModel => {
  const { panGesture, moverStyle, selectedCardIdx } = useCardSliderContext()
  const { sliderStyle, settingCard } = useCardSettingContext()
  const { cards } = useUserContext()
  const titleOpacity = useSharedValue(0)

  const cardLength = cards?.length ?? 1
  const isSetting = settingCard !== -1
  const cardTitleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }))

  useEffect(() => {
    if (settingCard !== -1) titleOpacity.value = 0
    else
      titleOpacity.value = withDelay(
        600,
        withTiming(1, {
          duration: 400,
          easing: Easing.out(Easing.cubic),
        }),
      )
  }, [settingCard, titleOpacity])

  return {
    state: {
      selectedCardIdx,
      cardLength,
      isSetting,
      cards,
    },
    animated: {
      sliderStyle,
      moverStyle,
      cardTitleStyle,
    },
    actions: { panGesture },
  }
}
