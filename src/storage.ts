import { MMKV } from 'react-native-mmkv';
export const kv = new MMKV();

export const cache = {
  getPhone: () => kv.getString('ble:phone') ?? null,
  setPhone: (v: string) => kv.set('ble:phone', v),
  getBLEDeviceId: () => kv.getString('ble:deviceId') ?? null,
  setBLEDeviceId: (k: string) => kv.set('ble:deviceId', k),
  getSerial: () => kv.getString('ble:serial'),
  setSerial: (v: string) => {
    kv.set('ble:serial', v);
  },
  lastSeenAt: () => kv.getNumber(`ble:lastSeen`) ?? 0,
  markSeen: () => kv.set(`ble:lastSeen:`, Date.now()),
  getPending: () => JSON.parse(kv.getString('ble:pending') ?? 'null'),
  setPending: (obj: {
    deviceId: string;
    phoneNumber: string;
    serial: string;
  }) => kv.set('ble:pending', JSON.stringify(obj)),
  clearPending: () => kv.set('ble:pending', 'null'),

  // settings
  setActive: (val: boolean) => kv.set('setting:active', val),
  getActive: () => kv.getBoolean('setting:active') ?? null,
  setNotice: (val: boolean) => kv.set('setting:notice', val),
  getNotice: () => kv.getBoolean('setting:notice') ?? null,
  setAutoSet: (val: boolean) => kv.set('setting:autoSet', val),
  getAutoSet: () => kv.getBoolean('setting:autoSet') ?? null,
};
