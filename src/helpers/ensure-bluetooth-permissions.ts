import { PermissionsAndroid, Platform } from 'react-native';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';

export const ensureBluetoothPermissions = async (): Promise<Boolean> => {
  if (Platform.OS === 'android') {
    if (Platform.Version >= 31) {
      const res = await PermissionsAndroid.requestMultiple([
        'android.permission.BLUETOOTH_SCAN',
        'android.permission.BLUETOOTH_CONNECT',
      ] as any);
      return Object.values(res).every(
        v => v === PermissionsAndroid.RESULTS.GRANTED,
      );
    } else {
      const res = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return res === PermissionsAndroid.RESULTS.GRANTED;
    }
  } else {
    const res = await request(PERMISSIONS.IOS.BLUETOOTH);
    return res === RESULTS.GRANTED;
  }
};
