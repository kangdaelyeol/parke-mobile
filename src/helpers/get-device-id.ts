import { Device } from 'react-native-ble-plx';
import { CHAR_UUID, DEFAULT_DEVICE_ID, SERVICE_UUID } from '../constants';

export const getDeviceId = async (device: Device): Promise<string | null> => {
  const ch = await device.readCharacteristicForService(SERVICE_UUID, CHAR_UUID);

  const deviceId = ch.value as string;

  if (deviceId === DEFAULT_DEVICE_ID) return null;

  return deviceId;
};
