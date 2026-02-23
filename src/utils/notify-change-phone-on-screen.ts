import { Alert } from 'react-native';
import { cache } from '@/storage';
import { cardService } from '@/services';

export const notifyChangePhoneOnScreen = (cardId: string, phone: string) => {
  Alert.alert('전화번호 변경', `${phone}으로 변경할까요?`, [
    {
      text: '취소',
      style: 'cancel',
      onPress: () => {
        cache.clearPending();
        cache.markLastDenied();
      },
    },
    {
      text: '변경',
      onPress: async () => {
        await cardService.updatePhone(cardId, phone);
        cache.clearPending();
        cache.clearDeniedAt();
      },
    },
  ]);
};
