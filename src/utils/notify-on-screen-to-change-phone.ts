import { Alert } from 'react-native';
import { deviceService } from '../services';
import { cache } from '../storage';

export const notifyOnScreenToChangePhone = (phoneNumber: string, deviceId: string) => {
  Alert.alert('전화번호 변경', `${phoneNumber}으로 변경할까요?`, [
    {
      text: '취소',
      style: 'cancel',
      onPress: () => cache.clearPending(),
    },
    {
      text: '변경',
      onPress: async () => {
        await deviceService.updatePhoneNumber(deviceId, phoneNumber);
        cache.clearPending();
      },
    },
  ]);
};
