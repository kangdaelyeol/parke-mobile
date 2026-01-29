import {
  useCardSettingContext,
  useCardSliderContext,
  useUserContext,
} from '@/contexts';
import { cardService } from '@/services';
import { Alert } from 'react-native';

export const useCardOption = () => {
  const { selectedCardIdx } = useCardSliderContext();
  const { cardSettingController } = useCardSettingContext();
  const { user, setCards, cards } = useUserContext();

  const selectedCard = cards[selectedCardIdx];

  const handlers = {
    onEditPressed: () => {
      cardSettingController.showSetting(selectedCardIdx);
    },
    onDeletePressed: async () => {
      Alert.alert('Parke 삭제', '삭제하시겠습니까? - (재등록 가능)', [
        {
          text: '삭제',
          onPress: async () => {
            const res = await cardService.delete(selectedCard);
            res &&
              setCards(prev =>
                prev.filter(card => card.id !== selectedCard.id),
              );
          },
        },
        { text: '취소', style: 'cancel' },
      ]);
    },
    onPreviewPressed: () => {},
    onAutoChangePressed: async () => {
      // await cardService.setAutoChange(cards[selectedIdx], !cards[selectedIdx].autoChange)
      setCards(prev =>
        prev.map(card =>
          card.id !== selectedCard.id
            ? { ...card }
            : { ...card, autoChange: !card.autoChange },
        ),
      );
    },
    onChangePhonePressed: async () => {
      const { phone } = user;
      // await cardService.setAutoChange(cards[selectedIdx], phone)
      // await userService.deleteCard(user, selectedCard.id)
      setCards(prev =>
        prev.map(card =>
          card.id !== selectedCard.id ? { ...card } : { ...card, phone },
        ),
      );
    },
  };

  return { user, handlers };
};
