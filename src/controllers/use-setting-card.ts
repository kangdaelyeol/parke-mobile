import {
  useCardSettingContext,
  useCardSliderContext,
  useUserContext,
} from '@/contexts';
import { CardDto } from '@/domain/card/card-dto';
import { cardService } from '@/services';
import { useEffect, useState } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export const useSettingCard = ({ card }: { card: CardDto }) => {
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

  const handlers = {
    savePress: async () => {
      cardSettingController.hideSetting();
      const res = await cardService.update({
        ...cards[selectedCardIdx],
        title,
        phone,
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
  };

  return {
    title,
    setTitle,
    message,
    setMessage,
    phone,
    setPhone,
    animatedStyle,
    handlers,
  };
};
