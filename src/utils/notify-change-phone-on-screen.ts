import { Alert } from 'react-native';
import { cacheClient } from '@/client';
import { cardService } from '@/services';
import { CardDto } from '@/domain/card';
import { convertPhone } from '@/helpers';

export const notifyChangePhoneOnScreen = (
  cardId: string,
  phone: string,
  setCards: React.Dispatch<React.SetStateAction<CardDto[]>>,
) => {
  Alert.alert('전화번호 변경', `${convertPhone(phone)}으로 변경할까요?`, [
    {
      text: '취소',
      style: 'cancel',
      onPress: () => {
        cacheClient.clearPending();
        cacheClient.markLastDenied();
      },
    },
    {
      text: '변경',
      onPress: async () => {
        await cardService.updatePhone(cardId, phone);
        setCards(prev => {
          const newCards = [...prev];
          const index = newCards.findIndex(c => c.id === cardId);
          if (index === -1) return prev;
          newCards[index].phone = phone;
          return newCards;
        });
        cacheClient.clearPending();
        cacheClient.clearDeniedAt();
      },
    },
  ]);
};
