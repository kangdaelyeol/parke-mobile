import { MMKV } from 'react-native-mmkv';
export const kv = new MMKV();

export const cache = {
  lastSeenAt: () => kv.getNumber(`ble:lastSeen`) ?? 0,
  markSeen: () => kv.set(`ble:lastSeen`, Date.now()),
  lastDeniedAt: () => kv.getNumber('ble:lastDenied') ?? 0,
  clearDeniedAt: () => kv.set('ble:lastDenied', 0),
  markLastDenied: () => kv.set('ble:lastDenied', Date.now()),
  getPending: () => JSON.parse(kv.getString('ble:pending') ?? 'null'),
  setPending: (obj: { phone: string; cardId: string }) =>
    kv.set('ble:pending', JSON.stringify(obj)),
  clearPending: () => kv.set('ble:pending', 'null'),

  // settings
  setActive: (val: boolean) => kv.set('setting:active', val),
  getActive: () => kv.getBoolean('setting:active') ?? null,
  setNotice: (val: boolean) => kv.set('setting:notice', val),
  getNotice: () => kv.getBoolean('setting:notice') ?? null,
  setAutoSet: (val: boolean) => kv.set('setting:autoSet', val),
  getAutoSet: () => kv.getBoolean('setting:autoSet') ?? null,

  // onBoarding
  getHasSeenOnBoarding: (): boolean =>
    kv.getBoolean('hasSeenOnBoarding') ?? false,
  setHasSeenOnBoarding: (v: boolean) => kv.set('hasSeenOnBoarding', v),
};
