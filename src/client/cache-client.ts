import { MMKV } from 'react-native-mmkv'
import { toDateKey } from '@/utils/format'
import type { CacheClient, PhoneChangePending } from './types'
import type { LoginProvider } from '@/services/types'
export const kv = new MMKV()

// 로그아웃·탈퇴 시 지우는 사용자별 기록 (ble:* 키 + 아래 키). 앱 설정·온보딩 여부는 남긴다
const USER_RECORD_KEYS = [
  'report:lastEmail',
  'today',
  'bleScanCount',
  'phoneChangeCount',
  'battery',
  'bleLastScan',
  'bleLastScanTime',
]

export const cacheClient: CacheClient = {
  // 기기 감지 기록 (카드 연결 해제 시)
  clearDeviceRecords: deviceId => {
    kv.delete(`ble:lastSeen-${deviceId}`)
    kv.delete(`ble:scan-${deviceId}`)
  },
  clearUserRecords: () => {
    kv.getAllKeys()
      .filter(key => key.startsWith('ble:') || USER_RECORD_KEYS.includes(key))
      .forEach(key => kv.delete(key))
  },
  setThemeId: v => kv.set('app:theme', v),
  getThemeId: () => kv.getString('app:theme') ?? '',
  setLoginProvider: v => kv.set('auth:loginProvider', v),
  getLoginProvider: () =>
    (kv.getString('auth:loginProvider') as LoginProvider) ?? '',
  // apple login
  setAppleUser: v => kv.set('apple:user', v),
  getAppleUser: () => kv.getString('apple:user') ?? null,
  // 운행 기록 이메일
  getLastReportEmail: () => kv.getString('report:lastEmail') ?? '',
  setLastReportEmail: email => kv.set('report:lastEmail', email),
  // global
  getHasInitializedCache: () => kv.getBoolean('initialized') ?? false,
  setHasInitializedCache: setting => kv.set('initialized', setting),
  getHasSeenOnBoarding: () => kv.getBoolean('hasSeenOnBoarding') ?? false,
  setHasSeenOnBoarding: v => kv.set('hasSeenOnBoarding', v),

  // ble device
  getDeviceSeenAt: deviceId => kv.getNumber(`ble:lastSeen-${deviceId}`) ?? 0,
  setDeviceSeenAt: (deviceId, time) => kv.set(`ble:lastSeen-${deviceId}`, time),
  getAlertDeniedAt: () => kv.getNumber('ble:lastDenied') ?? 0,
  setAlertDeniedAt: time => kv.set('ble:lastDenied', time),
  getAlertPendingList: () => {
    const pending = kv.getString('ble:pending')
    if (!pending) return []
    return (JSON.parse(pending) as (PhoneChangePending | null)[]).filter(
      (p): p is PhoneChangePending => !!p,
    )
  },
  setAlertPending: pendingList =>
    kv.set('ble:pending', JSON.stringify(pendingList)),
  markSimultaneousConnectionAlertAt: () =>
    kv.set('ble:simultaneous', Date.now()),
  getSimultaneousConnectionAlertAt: () => kv.getNumber('ble:simultaneous') ?? 0,
  getDeviceScan: deviceId => kv.getBoolean(`ble:scan-${deviceId}`) ?? true,
  setDeviceScan: (deviceId, scan) => kv.set(`ble:scan-${deviceId}`, scan),

  // setting
  setActive: setting => kv.set('setting:active', setting),
  getActive: () => kv.getBoolean('setting:active') ?? false,
  setNotice: setting => kv.set('setting:notice', setting),
  getNotice: () => kv.getBoolean('setting:notice') ?? false,
  setAutoSet: setting => kv.set('setting:autoSet', setting),
  getAutoSet: () => kv.getBoolean('setting:autoSet') ?? false,

  // today dashboard
  getToday: () => kv.getString('today') ?? toDateKey(),
  setToday: date => kv.set('today', date),
  getBleScanCount: () => kv.getNumber('bleScanCount') ?? 0,
  setBleScanCount: count => kv.set('bleScanCount', count),
  getPhoneChangeCount: () => kv.getNumber('phoneChangeCount') ?? 0,
  setPhoneChangeCount: count => kv.set('phoneChangeCount', count),
  getBatteryLevel: () => kv.getString('battery') ?? '0',
  setBatteryLevel: level => kv.set('battery', level),
  getLastScanDeviceName: () => kv.getString('bleLastScan') ?? '',
  setLastScanDeviceName: deviceName => kv.set('bleLastScan', deviceName),
  getLastScanTime: () => kv.getNumber('bleLastScanTime') ?? Date.now(),
  markLastScanTime: () => kv.set('bleLastScanTime', Date.now()),
}
