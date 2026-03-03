import { Device } from 'react-native-ble-plx';
import { CHAR_UUID, SERVICE_UUID } from '@/constants';

export const getDeviceId = async (device: Device): Promise<string | null> => {
  const d = await device.connect();
  await d.discoverAllServicesAndCharacteristics();
  const ch = await d.readCharacteristicForService(SERVICE_UUID, CHAR_UUID);
  console.log('raw ch.value=', ch.value);
  const deviceId = ch.value as string;

  return deviceId;
};
