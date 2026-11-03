import { useEffect } from 'react'
import {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { BLUE_PRIMARY } from '@/theme/color'
import { GLASS, withAlpha } from '@/theme/glass'
import { ToggleProps, ToggleViewModel } from './types'

// 애니메이션 스타일(worklet) 안에서는 일반 함수를 부를 수 없어 색을 미리 계산해 둔다
const TRACK_ON = withAlpha(BLUE_PRIMARY, 0.85)
const TRACK_ON_BORDER = withAlpha(BLUE_PRIMARY, 0.95)

export const useToggleViewModel = ({
  value,
  disabled,
  onValueChange,
}: ToggleProps): ToggleViewModel => {
  const toggleProgress = useSharedValue(0)

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: 28 - toggleProgress.value * 28 }],
  }))

  // 켜짐: 파란 유리 / 꺼짐: 투명한 유리 (progress 0 = 켜짐)
  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      toggleProgress.value,
      [0, 1],
      [TRACK_ON, GLASS.fill],
    ),
    borderColor: interpolateColor(
      toggleProgress.value,
      [0, 1],
      [TRACK_ON_BORDER, GLASS.border],
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
