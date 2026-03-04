import { MMKV } from 'react-native-mmkv';
import { AlertPending } from '@/client';
export const kv = new MMKV();

export const cacheClient = {
  // global
  getHasInitializedCache: (): boolean => kv.getBoolean('initialized') ?? false,
  setHasInitializedCache: (setting: boolean) => kv.set('initialized', setting),
  getHasSeenOnBoarding: (): boolean =>
    kv.getBoolean('hasSeenOnBoarding') ?? false,
  setHasSeenOnBoarding: (v: boolean) => kv.set('hasSeenOnBoarding', v),

  // ble device
  getDeviceSeenAt: (deviceId: string): number =>
    kv.getNumber(`ble:lastSeen-${deviceId}`) ?? 0,
  setDeviceSeenAt: (deviceId: string, time: number) =>
    kv.set(`ble:lastSeen-${deviceId}`, time),
  getAlertDeniedAt: (): number => kv.getNumber('ble:lastDenied') ?? 0,
  setAlertDeniedAt: (time: number) => kv.set('ble:lastDenied', time),
  getAlertPendingList: (): AlertPending[] => {
    const pending = kv.getString('ble:pending');
    return pending ? JSON.parse(pending) : [];
  },
  setAlertPending: (pendingList: AlertPending[]) =>
    kv.set('ble:pending', JSON.stringify(pendingList)),

  // setting
  setActive: (setting: boolean) => kv.set('setting:active', setting),
  getActive: (): boolean => kv.getBoolean('setting:active') ?? false,
  setNotice: (setting: boolean) => kv.set('setting:notice', setting),
  getNotice: (): boolean => kv.getBoolean('setting:notice') ?? false,
  setAutoSet: (setting: boolean) => kv.set('setting:autoSet', setting),
  getAutoSet: (): boolean => kv.getBoolean('setting:autoSet') ?? false,
};
