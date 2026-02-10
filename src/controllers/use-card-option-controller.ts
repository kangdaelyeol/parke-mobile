import { useState } from 'react';
import { Alert } from 'react-native';
import {
  useCardSettingContext,
  useCardSliderContext,
  useUserContext,
} from '@/contexts';
import { cardService } from '@/services';

export const useCardOptionController = () => {
  const { selectedCardIdx } = useCardSliderContext();
  const { cardSettingController } = useCardSettingContext();
  const { user, setCards, cards } = useUserContext();
  const [loading, setLoading] = useState(false);

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
            setLoading(true);
            const res = await cardService.delete(selectedCard.id);
            if (!res) {
              Alert.alert('오류가 발생했습니다. 다시 시도해주세요.');
              return setLoading(false);
            }
            setLoading(false);

            setCards(prev => prev.filter(card => card.id !== selectedCard.id));
          },
        },
        { text: '취소', style: 'cancel' },
      ]);
    },
    onPreviewPressed: () => {},
    onAutoChangePressed: async () => {
      setLoading(true);
      const res = await cardService.updateAutoChange(
        selectedCard.id,
        !selectedCard.autoChange,
      );
      if (!res) {
        Alert.alert('오류가 발생했습니다. 다시 시도해주세요.');
        return setLoading(false);
      }
      setLoading(false);
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
      setLoading(true);
      const res = await cardService.updatePhone(selectedCard.id, phone);
      if (!res) {
        Alert.alert('오류가 발생했습니다. 다시 시도해주세요.');
        return setLoading(false);
      }
      setLoading(false);
      setCards(prev =>
        prev.map(card =>
          card.id !== selectedCard.id ? { ...card } : { ...card, phone },
        ),
      );
    },
  };

  return { user, handlers, loading };
};
