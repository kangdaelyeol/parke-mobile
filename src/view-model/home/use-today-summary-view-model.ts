import { useState, useEffect } from 'react'
import {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  Easing,
  withTiming,
} from 'react-native-reanimated'
import { HomeTodaySummaryViewModel } from '@home/types'
import { useUserContext } from '@/contexts'
import { cacheService } from '@/services'

export const useTodaySummaryViewModel = (): HomeTodaySummaryViewModel => {
  const { stateSession } = useUserContext()
  const [deviceName, setDeviceName] = useState('test1')
  const [bleScanCount, setBleScanCount] = useState(0)
  const [phoneChangeCount, setPhoneChangeCount] = useState(0)
  const [batteryLevel, setBatteryLevel] = useState('50')
  const [lastScanTime, setLastScanTime] = useState(0)
  const containerOpacity = useSharedValue(0)

  useEffect(() => {
    const cacheState = cacheService.getTodayDashBoard()
    setDeviceName(cacheState.lastScanDeviceName)
    setBleScanCount(cacheState.bleScanCount)
    setPhoneChangeCount(cacheState.phoneChangeCount)
    setBatteryLevel(cacheState.batteryLevel)
    setLastScanTime(Math.floor((Date.now() - cacheState.lastScanTime) / 1000))
  }, [stateSession])

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
    actions: {},
  }
}
