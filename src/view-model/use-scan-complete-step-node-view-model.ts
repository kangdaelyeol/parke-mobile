import { useEffect } from 'react'
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'
import { useScanCompleteContext } from '@/contexts'
import {
  ScanCompleteStepNodeViewModelProps,
  ScanCompleteStepNodeViewModel,
} from '@scan-complete/types'

export const useScanCompleteStepNodeViewModel = ({
  step,
}: ScanCompleteStepNodeViewModelProps): ScanCompleteStepNodeViewModel => {
  const {
    state: { currentStep },
  } = useScanCompleteContext()
  const dotScale = useSharedValue(0)
  const checkIconOpacity = useSharedValue(0)

  useEffect(() => {
    if (step === currentStep) {
      dotScale.value = withTiming(1, {
        duration: 300,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
      })
      checkIconOpacity.value = withDelay(
        500,
        withTiming(0, {
          duration: 200,
          easing: Easing.bezier(0.33, 1, 0.68, 1),
        }),
      )
    }

    if (step < currentStep) {
      dotScale.value = withTiming(2, {
        duration: 300,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
      })
      checkIconOpacity.value = withDelay(
        300,
        withTiming(1, { duration: 200, easing: Easing.linear }),
      )
    }

    if (step > currentStep) {
      dotScale.value = withTiming(0, {
        duration: 300,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
      })
      checkIconOpacity.value = withDelay(
        500,
        withTiming(0, {
          duration: 200,
          easing: Easing.bezier(0.33, 1, 0.68, 1),
        }),
      )
    }
  }, [checkIconOpacity, currentStep, dotScale, step])

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }],
  }))

  const checkIconStyle = useAnimatedStyle(() => ({
    opacity: checkIconOpacity.value,
  }))

  return {
    state: { currentStep },
    actions: {},
    animated: { dotStyle, checkIconStyle },
  }
}
