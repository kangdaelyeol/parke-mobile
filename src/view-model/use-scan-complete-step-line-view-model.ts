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
import { useScanCompleteContext } from '@/contexts'

export const useScanCompleteStepLineViewModel = ({
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

  const lineStyle = useAnimatedStyle(() => ({
    width: activeLineWidth.value * 190,
  }))

  return {
    state: {},
    actions: {},
    animated: { lineStyle },
  }
}
