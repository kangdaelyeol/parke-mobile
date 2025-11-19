import { MMKV } from 'react-native-mmkv';
export const kv = new MMKV();

export const cache = {
  getPhone: () => kv.getString('ble:phone') ?? null,
  setPhone: (v: string) => kv.set('ble:phone', v),
  getBLEDeviceId: () => kv.getString('ble:deviceId') ?? null,
  setBLEDeviceId: (k: string) => kv.set('ble:deviceId', k),
  lastSeenAt: (k: string) => kv.getNumber(`ble:lastSeen:${k}`) ?? 0,
  markSeen: (k: string) => kv.set(`ble:lastSeen:${k}`, Date.now()),
};
