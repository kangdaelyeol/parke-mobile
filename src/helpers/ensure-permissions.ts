import { PermissionsAndroid, Platform } from 'react-native';

export const ensurePermissions = async (): Promise<Boolean> => {
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
  }

  return true;
};
