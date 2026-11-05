import { useEffect } from 'react'
import {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { GLASS, withAlpha } from '@/theme/glass'
import { useThemed } from '@/theme/themed'
import { ToggleProps, ToggleViewModel } from './types'

// 글래스 켜짐 색: 영상에서 켜짐·정상 상태에 쓰는 에메랄드 (알약 글자색보다 한 단계 짙게)
const TRACK_COLOR = '#10b981'
const NONE = 'rgba(0,0,0,0)'

// 테마별 바탕·테두리 색 [켜짐, 꺼짐].
// 애니메이션 스타일(worklet) 안에서는 일반 함수를 부를 수 없어 색을 미리 계산해 둔다
const TRACK_PALETTE = {
  // 기본 테마: 파란 바탕 / 어두운 바탕, 테두리 없음
  classic: { on: '#3b3bf9', off: '#2a2a2a', borderOn: NONE, borderOff: NONE },
  'glass-dashboard': {
    on: withAlpha(TRACK_COLOR, 0.85),
    off: GLASS.fill,
    borderOn: withAlpha(TRACK_COLOR, 0.95),
    borderOff: GLASS.border,
  },
}

export const useToggleViewModel = ({
  value,
  disabled,
  onValueChange,
}: ToggleProps): ToggleViewModel => {
  const toggleProgress = useSharedValue(0)
  const palette = useThemed(TRACK_PALETTE)

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: 28 - toggleProgress.value * 28 }],
  }))

  // progress 0 = 켜짐, 1 = 꺼짐
  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      toggleProgress.value,
      [0, 1],
      [palette.on, palette.off],
    ),
    borderColor: interpolateColor(
      toggleProgress.value,
      [0, 1],
      [palette.borderOn, palette.borderOff],
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
