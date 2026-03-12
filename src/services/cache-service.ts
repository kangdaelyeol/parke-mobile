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
  getAndSetTodayDashBoard: () => {
    const cacheToday = cacheClient.getToday()
    const nowToday = new Date().toISOString().slice(0, 10)

    if (cacheToday !== nowToday) {
      cacheClient.setBleScanCount(0)
      cacheClient.setPhoneChangeCount(0)
      cacheClient.setToday(nowToday)
    }
  },
  increasePhoneChangeCount: () => {
    const phoneChangeCount = cacheClient.getPhoneChangeCount()
    cacheClient.setPhoneChangeCount(phoneChangeCount + 1)
  },
  increaseBleScanCount: () => {
    const bleScanCount = cacheClient.getBleScanCount()
    cacheClient.setBleScanCount(bleScanCount + 1)
  },
  getBatteryLevel: () => {
    return cacheClient.getBatteryLevel()
  },
  setBatteryLevel: (level: string) => {
    cacheClient.setBatteryLevel(level)
  },
}
