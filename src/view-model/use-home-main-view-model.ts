import {
  useCardSettingContext,
  useCardSliderContext,
  useUserContext,
} from '@/contexts';
import { HomeMainViewModel } from '@home/types';

export const useHomeMainViewModel = (): HomeMainViewModel => {
  const { panGesture, moverStyle, selectedCardIdx } = useCardSliderContext();
  const { sliderStyle, settingCard } = useCardSettingContext();
  const { cards } = useUserContext();

  const cardLength = cards?.length ?? 1;
  const isSetting = settingCard !== -1;

  return {
    state: {
      selectedCardIdx,
      cardLength,
      isSetting,
      cards,
    },
    animated: {
      sliderStyle,
      moverStyle,
    },
    actions: { panGesture },
  };
};
