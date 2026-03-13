import { cacheClient } from '@/client'
import { CacheService } from './types'

export const cacheService: CacheService = {
  ensureInitialized: () => {
    const hasInitializedCache = cacheClient.getHasInitializedCache()
    if (hasInitializedCache) return

    cacheClient.setNotice(true)
    cacheClient.setAutoSet(true)
    cacheClient.setActive(true)
    cacheClient.setHasSeenOnBoarding(false)
    cacheClient.setAlertPending([])
    cacheClient.setAlertDeniedAt(0)
    cacheClient.setHasInitializedCache(true)
    cacheClient.setBleScanCount(0)
    cacheClient.setPhoneChangeCount(0)
    cacheClient.setToday(new Date().toISOString().slice(0, 10))
  },
  setHasSeenOnBoarding: value => {
    cacheClient.setHasSeenOnBoarding(value)
  },
  getHasSeenOnBoarding: () => {
    return cacheClient.getHasSeenOnBoarding()
  },
  ensureTodayDashBoardCache: () => {
    const cacheToday = cacheClient.getToday()
    const nowToday = new Date().toISOString().slice(0, 10)

    if (cacheToday !== nowToday) {
      cacheClient.setBleScanCount(0)
      cacheClient.setPhoneChangeCount(0)
      cacheClient.setToday(nowToday)
    }
  },
  getTodayDashBoard: () => {
    const batteryLevel = cacheClient.getBatteryLevel()
    const bleScanCount = cacheClient.getBleScanCount()
    const phoneChangeCount = cacheClient.getPhoneChangeCount()
    const lastScanDeviceName = cacheClient.getLastScanDeviceName()
    const lastScanTime = cacheClient.getLastScanTime()
    return {
      batteryLevel,
      bleScanCount,
      phoneChangeCount,
      lastScanDeviceName,
      lastScanTime,
    }
  },
}
