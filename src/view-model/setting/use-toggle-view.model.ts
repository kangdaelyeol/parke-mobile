import { useEffect } from 'react'
import {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { SettingToggleViewModel } from '@setting/types'
import { ToggleProps } from '@/components/types'

export const useToggleViewModel = ({
  value,
  disabled,
  onValueChange,
}: ToggleProps): SettingToggleViewModel => {
  const toggleProgress = useSharedValue(0)

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: 28 - toggleProgress.value * 28 }],
  }))

  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      toggleProgress.value,
      [0, 1],
      ['#3b3bf9', '#2a2a2a'],
    ),
  }))

  const handleTogglePress = () => {
    if (disabled) return
    onValueChange(!value)
  }

  useEffect(() => {
    if (value === true) {
      toggleProgress.value = withTiming(0, {
        duration: 550,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
      })
    } else {
      toggleProgress.value = withTiming(1, {
        duration: 550,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
      })
    }
  }, [value, toggleProgress])

  return {
    state: {},
    actions: {
      handleTogglePress,
    },
    animated: { dotStyle, backgroundStyle },
  }
}
