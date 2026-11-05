import { useEffect } from 'react'
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import {
  ScanCompleteStepLineViewModelProps,
  ScanCompleteStepLineViewModel,
} from '@scan-complete/types'
import { useScanCompleteContext } from '@scan-complete/contexts'

export const useStepLineViewModel = ({
  step,
}: ScanCompleteStepLineViewModelProps): ScanCompleteStepLineViewModel => {
  const {
    state: { currentStep },
  } = useScanCompleteContext()
  const activeLineWidth = useSharedValue(0)

  useEffect(() => {
    if (currentStep > step) {
      activeLineWidth.value = withTiming(1, {
        duration: 300,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
      })
    } else {
      activeLineWidth.value = withTiming(0, {
        duration: 300,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
      })
    }
  }, [step, currentStep, activeLineWidth])

  // 너비를 바꾸는 대신 왼쪽을 기준으로 늘린다 (매 프레임 레이아웃을 다시 계산하지 않는다)
  const lineStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: activeLineWidth.value }],
  }))

  return {
    state: {},
    actions: {},
    animated: { lineStyle },
  }
}
