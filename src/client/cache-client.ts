import { MMKV } from 'react-native-mmkv'
import { AlertPending, CacheClient } from '@/client'
import { LoginProvider } from '@/services/types'
export const kv = new MMKV()

export const cacheClient: CacheClient = {
  setLoginProvider: v => kv.set('auth:loginProvider', v),
  getLoginProvider: () =>
    (kv.getString('auth:loginProvider') as LoginProvider) ?? '',
  // apple login
  setAppleUser: v => kv.set('apple:user', v),
  getAppleUser: () => kv.getString('apple:user') ?? null,
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
    return pending ? JSON.parse(pending) : ([] as AlertPending[])
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
  getToday: () =>
    kv.getString('today') ?? new Date().toISOString().slice(0, 10),
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
