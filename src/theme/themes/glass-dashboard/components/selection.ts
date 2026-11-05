import { useEffect } from 'react'
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated'

// 고른 칸이 바뀔 때 유리 알약이 나타나고 사라지는 시간 (영상 사이드바 메뉴: 약 4프레임)
export const SELECT_MS = 150
// 메뉴를 누르는 동안 옅은 알약이 깔리고 밀리는 시간 (영상의 마우스를 올렸을 때와 같은 길이)
export const PRESS_MS = 150
// 누르는 동안 떠오르는 카드 (영상 코드의 whileHover y:-5, framer-motion 기본 스프링)
export const LIFT_Y = -5
export const LIFT_SPRING = { stiffness: 500, damping: 25, mass: 1 }

export const SELECT_TIMING = {
  duration: SELECT_MS,
  easing: Easing.out(Easing.quad),
}

// 고름 진행값 (0: 안 고름 ~ 1: 고름). 처음에는 애니메이션 없이 지금 상태에서 시작한다
export const useSelectionProgress = (selected: boolean) => {
  const progress = useSharedValue(selected ? 1 : 0)
  useEffect(() => {
    progress.value = withTiming(selected ? 1 : 0, SELECT_TIMING)
  }, [selected, progress])
  return progress
}
