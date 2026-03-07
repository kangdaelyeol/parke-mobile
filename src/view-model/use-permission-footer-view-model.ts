import { useNavigation } from '@react-navigation/native';
import { PermissionStackNavigationProp } from '@/navigation/types';
import { PermissionFooterViewModel } from '@/screens/permission/types';
import { permissionService } from '@/services';

export const usePermissionFooterViewModel = (): PermissionFooterViewModel => {
  const {
    ensureBluetoothPermission,
    ensureCameraPermission,
    ensureNotificationPermission,
  } = permissionService;

  const navigation = useNavigation<PermissionStackNavigationProp>();

  const onConfirmPress = async () => {
    await ensureBluetoothPermission();
    await ensureCameraPermission();
    await ensureNotificationPermission();
    navigation.replace('Login');
  };

  return {
    state: {},
    actions: { onConfirmPress },
  };
};
