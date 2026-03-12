import { useState } from 'react'
import {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  Easing,
  withTiming,
} from 'react-native-reanimated'
import { useEffect } from 'react'

export const useTodaySummaryViewModel = () => {
  const [deviceName, setDeviceName] = useState('test1')
  const [bleScanCount, setBleScanCount] = useState(0)
  const [phoneChangeCount, setPhoneChangeCount] = useState(0)
  const [batteryLevel, setBatteryLevel] = useState(50)
  const [lastScanTime, setLastScanTime] = useState(0)
  const containerOpacity = useSharedValue(0)

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }))

  useEffect(() => {
    containerOpacity.value = withDelay(
      400,
      withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) }),
    )
  }, [containerOpacity])

  return {
    state: {
      deviceName,
      bleScanCount,
      phoneChangeCount,
      batteryLevel,
      lastScanTime,
    },
    animated: {
      containerStyle,
    },
  }
}
