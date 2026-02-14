import { useState } from 'react';
import { Alert } from 'react-native';
import {
  useCardSettingContext,
  useCardSliderContext,
  useUserContext,
} from '@/contexts';
import { cardService, userService } from '@/services';
import { CardOptionViewModel } from '@home/types';

export const useHomeCardOptionViewModel = (): CardOptionViewModel => {
  const { selectedCardIdx } = useCardSliderContext();
  const { cardSettingController } = useCardSettingContext();
  const { user, setCards, cards } = useUserContext();
  const [loading, setLoading] = useState(false);

  const selectedCard = cards[selectedCardIdx];

  const actions = {
    editPress: () => {
      cardSettingController.showSetting(selectedCardIdx);
    },
    deletePress: () => {
      Alert.alert('Parke 삭제', '삭제하시겠습니까? - (재등록 가능)', [
        {
          text: '삭제',
          onPress: async () => {
            setLoading(true);

            const filteredCardList = cards.filter(
              card => card.id !== selectedCard.id,
            );
            const cardDeleteRes = await cardService.delete(selectedCard.id);

            if (!cardDeleteRes) {
              Alert.alert('오류가 발생했습니다. 다시 시도해주세요.');
              return setLoading(false);
            }

            userService.updateCardList(user.id, filteredCardList);

            setLoading(false);
            setCards(filteredCardList);
          },
        },
        { text: '취소', style: 'cancel' },
      ]);
    },
    previewPress: () => {},
    autoChangePress: async () => {
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
    changePhonePress: async () => {
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

  return { state: { user, loading }, actions };
};
