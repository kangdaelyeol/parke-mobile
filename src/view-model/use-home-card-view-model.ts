import { Easing, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useCardSettingContext, useCardSliderContext } from '@/contexts';
import { CardViewModel } from '@home/types';

export const useHomeCardViewModel = (idx: number): CardViewModel=> {
  const { settingCard } = useCardSettingContext();
  const { selectedCardIdx, sliderController } = useCardSliderContext();
  const isSelected = idx === selectedCardIdx;
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isSelected ? 1 : 0.4, { duration: 200 }),
      transform: [
        {
          translateY: withTiming(isSelected ? 0 : 15, {
            easing: Easing.out(Easing.cubic),
            duration: 150,
          }),
        },
      ],
    };
  });

  const cardPress = () => {
    if (settingCard !== -1) return;

    if (!isSelected) sliderController.goToIdx(idx);
  };

  return {
    state: { animatedStyle },
    actions: { cardPress },
  };
};
