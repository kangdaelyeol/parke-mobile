import { Device } from 'react-native-ble-plx';
import { CHAR_UUID, SERVICE_UUID } from '@/constants';

export const getDeviceId = async (device: Device): Promise<string | null> => {
  const ch = await device.readCharacteristicForService(SERVICE_UUID, CHAR_UUID);
  console.log('raw ch.value=', ch.value);
  const deviceId = ch.value as string;

  return deviceId;
};
