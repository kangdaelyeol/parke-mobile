import { convertPhone } from '@/helpers';
import { extractNumber } from '@/utils';
import { useEffect, useState } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  useCardSettingContext,
  useCardSliderContext,
  useUserContext,
} from '@/contexts';
import { cardService } from '@/services';
import { CardDto } from '@/domain/card';
import { SettingCardViewModel } from '@home/types';

export const useHomeSettingCardViewModel = (
  card: CardDto,
): SettingCardViewModel => {
  const { cardSettingController } = useCardSettingContext();
  const { selectedCardIdx } = useCardSliderContext();
  const { cards, setCards } = useUserContext();

  const [title, setTitle] = useState(card.title);
  const [phone, setPhone] = useState(card.phone);
  const [message, setMessage] = useState(card.message);
  const opacityVal = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(opacityVal.value, {
      duration: 400,
    }),
  }));

  useEffect(() => {
    opacityVal.value = 1;
  }, [opacityVal]);

  const actions = {
    savePress: async () => {
      cardSettingController.hideSetting();
      const res = await cardService.update({
        ...cards[selectedCardIdx],
        title,
        phone: extractNumber(phone),
        message,
      });

      if (res) {
        setCards(prev => {
          const index = cards.findIndex(
            cd => cd.id === cards[selectedCardIdx].id,
          );
          const newCards = [...prev];
          newCards[index] = res;
          return newCards;
        });
      } else {
        // Display Error
      }
    },
    cancelPress: () => {
      cardSettingController.hideSetting();
    },
    titleInput: (val: string) => setTitle(val),
    messageInput: (val: string) => setMessage(val),
    phoneInput: (val: string) => setPhone(convertPhone(val)),
  };

  return {
    state: {
      title,
      message,
      phone: convertPhone(phone),
      animatedStyle,
    },
    actions,
  };
};
