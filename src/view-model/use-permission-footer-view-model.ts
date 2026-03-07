import notifee from '@notifee/react-native';
import { useCameraPermission } from 'react-native-vision-camera';
import { ensureBluetoothPermissions } from '@/helpers';
import { useNavigation } from '@react-navigation/native';
import { PermissionStackNavigationProp } from '@/navigation/types';
import { PermissionFooterViewModel } from '@/screens/permission/types';

export const usePermissionFooterViewModel = (): PermissionFooterViewModel => {
  const {
    hasPermission: hasCameraPermission,
    requestPermission: requestCameraPermission,
  } = useCameraPermission();

  const navigation = useNavigation<PermissionStackNavigationProp>();

  const onConfirmPress = async () => {
    console.log(hasCameraPermission);
    if (!hasCameraPermission) {
      await requestCameraPermission();
    }
    await notifee.requestPermission();

    await ensureBluetoothPermissions();
    navigation.replace('Login');
  };

  return {
    state: {},
    actions: { onConfirmPress },
  };
};
