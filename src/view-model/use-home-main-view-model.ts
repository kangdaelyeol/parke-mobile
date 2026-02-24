import {
  useCardSettingContext,
  useCardSliderContext,
  useUserContext,
} from '@/contexts';
import { MainViewModel } from '@home/types';

export const useHomeMainViewModel = (): MainViewModel => {
  const { panGesture, animatedStyle, selectedCardIdx } = useCardSliderContext();
  const { sliderAnimatedStyle, settingCard } = useCardSettingContext();
  const { cards } = useUserContext();

  const cardLength = cards?.length ?? 1;
  const isSetting = settingCard !== -1;

  return {
    state: {
      sliderAnimatedStyle,
      animatedStyle,
      selectedCardIdx,
      cardLength,
      isSetting,
      cards,
    },
    actions: { panGesture },
  };
};
