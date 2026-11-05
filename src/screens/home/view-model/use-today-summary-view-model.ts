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
import { useNow } from '@/hooks'
import { cacheService } from '@/services'

const MINUTE_MS = 60 * 1000

export const useTodaySummaryViewModel = (): HomeTodaySummaryViewModel => {
  const { stateSession } = useUserContext()
  // 첫 그림부터 기기에 저장된 값을 보여주고, 감지가 있을 때마다 다시 읽는다
  const [dashboard, setDashboard] = useState(() =>
    cacheService.getTodayDashBoard(),
  )
  // 마지막 감지가 몇 분 전인지, 홈에 머무는 동안에도 1분마다 다시 센다
  const now = useNow(MINUTE_MS)
  const containerOpacity = useSharedValue(0)

  useEffect(() => {
    setDashboard(cacheService.getTodayDashBoard())
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
      deviceName: dashboard.lastScanDeviceName,
      bleScanCount: dashboard.bleScanCount,
      phoneChangeCount: dashboard.phoneChangeCount,
      batteryLevel: dashboard.batteryLevel,
      lastScanTime: Math.max(
        0,
        Math.floor((now - dashboard.lastScanTime) / MINUTE_MS),
      ),
    },
    animated: {
      containerStyle,
    },
    actions: {},
  }
}
