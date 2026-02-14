import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
  useCardSettingContext,
  useCardSliderContext,
  useUserContext,
} from '@/contexts';
import { cardService } from '@/services';
import { CardDto } from '@/domain/card';
import { MainViewModel } from '@home/types';

const isCardList = (v: any): v is CardDto[] => {
  return v !== null;
};

export const useHomeMainViewModel = (): MainViewModel => {
  const { panGesture, animatedStyle, selectedCardIdx } = useCardSliderContext();
  const { sliderAnimatedStyle, settingCard } = useCardSettingContext();
  const { cards, setCards, user } = useUserContext();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const cardIdList = Object.values(user.cardIdList ?? {}) || [];
      const res = await cardService.getList(cardIdList);
      if (isCardList(res)) setCards(res);
      else Alert.alert('오류가 발생했');
      setLoading(false);
    })();
  }, [setCards, user.cardIdList]);

  const cardLength = cards?.length ?? 1;
  const isSetting = settingCard !== -1;

  return {
    state: {
      sliderAnimatedStyle,
      animatedStyle,
      selectedCardIdx,
      cardLength,
      isSetting,
      loading,
      cards,
    },
    actions: { panGesture },
  };
};
