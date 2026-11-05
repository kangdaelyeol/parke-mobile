import { useEffect } from 'react'
import {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { GLASS, withAlpha } from '@/theme/glass'
import { ToggleProps, ToggleViewModel } from './types'

// 켜짐 색: 영상에서 켜짐·정상 상태에 쓰는 에메랄드 (알약 글자색보다 한 단계 짙게)
const TRACK_COLOR = '#10b981'
// 애니메이션 스타일(worklet) 안에서는 일반 함수를 부를 수 없어 색을 미리 계산해 둔다
const TRACK_ON = withAlpha(TRACK_COLOR, 0.85)
const TRACK_ON_BORDER = withAlpha(TRACK_COLOR, 0.95)

export const useToggleViewModel = ({
  value,
  disabled,
  onValueChange,
}: ToggleProps): ToggleViewModel => {
  const toggleProgress = useSharedValue(0)

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: 28 - toggleProgress.value * 28 }],
  }))

  // 켜짐: 초록 유리 / 꺼짐: 투명한 유리 (progress 0 = 켜짐)
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
