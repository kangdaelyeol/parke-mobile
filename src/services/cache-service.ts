import { cacheClient } from '@/client'
import { toDateKey } from '@/utils/format'
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
  // 로그아웃·탈퇴 시 기기에 남은 사용자별 기록(BLE 감지, 오늘의 현황, 수신 이메일)을 지운다
  clearUserData: () => cacheClient.clearUserRecords(),
  setHasSeenOnBoarding: value => cacheClient.setHasSeenOnBoarding(value),
  getHasSeenOnBoarding: () => cacheClient.getHasSeenOnBoarding(),
  ensureTodayDashBoardCache: () => {
    const cacheToday = cacheClient.getToday()
    const nowToday = toDateKey()

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
  getAppleUser: () => cacheClient.getAppleUser(),
  setAppleUser: id => cacheClient.setAppleUser(id),
  clearAppleUser: () => cacheClient.setAppleUser(''),
  setThemeId: id => cacheClient.setThemeId(id),
  getThemeId: () => cacheClient.getThemeId(),
  setLoginProvider: provider => cacheClient.setLoginProvider(provider),
  getLoginProvider: () => cacheClient.getLoginProvider(),
  clearLoginProvider: () => cacheClient.setLoginProvider(''),
}
