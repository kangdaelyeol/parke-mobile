import { Alert } from 'react-native';
import { cache } from '@/storage';
import { cardService } from '@/services';
import { CardDto } from '@/domain/card';

export const notifyChangePhoneOnScreen = (
  cardId: string,
  phone: string,
  setCards: React.Dispatch<React.SetStateAction<CardDto[]>>,
) => {
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
        setCards(prev => {
          const newCards = [...prev];
          const index = newCards.findIndex(c => c.id === cardId);
          if (index === -1) return prev;
          newCards[index].phone = phone;
          return newCards;
        });
        cache.clearPending();
        cache.clearDeniedAt();
      },
    },
  ]);
};
