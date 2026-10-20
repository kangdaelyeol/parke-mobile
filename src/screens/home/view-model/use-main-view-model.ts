import { useEffect } from 'react'
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'
import { useCardSettingContext, useCardSliderContext } from '@home/contexts'
import { useUserContext } from '@/contexts'
import { HomeMainViewModel } from '@home/types'

export const useMainViewModel = (): HomeMainViewModel => {
  const { panGesture, moverStyle, selectedCardIdx } = useCardSliderContext()
  const { sliderStyle, homeContentStyle, settingCard } = useCardSettingContext()
  const { cards } = useUserContext()
  const titleOpacity = useSharedValue(0)

  const cardLength = cards?.length ?? 1
  const isSetting = settingCard !== -1
  const cardTitleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }))

  useEffect(() => {
    if (settingCard !== -1) titleOpacity.value = 0
    // 수정 화면은 닫는 애니메이션이 끝난 뒤에 내려가므로 짧게만 기다린다
    else
      titleOpacity.value = withDelay(
        100,
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
      homeContentStyle,
      moverStyle,
      cardTitleStyle,
    },
    actions: { panGesture },
  }
}
