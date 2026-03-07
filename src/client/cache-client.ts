import { MMKV } from 'react-native-mmkv'
import { AlertPending, CacheClient } from '@/client'
export const kv = new MMKV()

export const cacheClient: CacheClient = {
  // global
  getHasInitializedCache: () => kv.getBoolean('initialized') ?? false,
  setHasInitializedCache: setting => kv.set('initialized', setting),
  getHasSeenOnBoarding: () => kv.getBoolean('hasSeenOnBoarding') ?? false,
  setHasSeenOnBoarding: v => kv.set('hasSeenOnBoarding', v),

  // ble device
  getDeviceSeenAt: (deviceId: string): number =>
    kv.getNumber(`ble:lastSeen-${deviceId}`) ?? 0,
  setDeviceSeenAt: (deviceId: string, time: number) =>
    kv.set(`ble:lastSeen-${deviceId}`, time),
  getAlertDeniedAt: (): number => kv.getNumber('ble:lastDenied') ?? 0,
  setAlertDeniedAt: (time: number) => kv.set('ble:lastDenied', time),
  getAlertPendingList: (): AlertPending[] => {
    const pending = kv.getString('ble:pending')
    return pending ? JSON.parse(pending) : []
  },
  setAlertPending: (pendingList: AlertPending[]) =>
    kv.set('ble:pending', JSON.stringify(pendingList)),

  // setting
  setActive: setting => kv.set('setting:active', setting),
  getActive: () => kv.getBoolean('setting:active') ?? false,
  setNotice: setting => kv.set('setting:notice', setting),
  getNotice: () => kv.getBoolean('setting:notice') ?? false,
  setAutoSet: setting => kv.set('setting:autoSet', setting),
  getAutoSet: () => kv.getBoolean('setting:autoSet') ?? false,
}
