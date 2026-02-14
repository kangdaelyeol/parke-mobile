import { CardViewModel } from "@home/types";
import {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useCardSettingContext, useCardSliderContext } from '@/contexts';
import { HomeStackNavigationProp } from '@/navigation/types';

export const useHomeEmptyCardViewModel = (idx: number):CardViewModel => {
    const navigation = useNavigation<HomeStackNavigationProp>();
    const { selectedCardIdx, sliderController } = useCardSliderContext();
    const { settingCard } = useCardSettingContext();
  
    const animatedStyle = useAnimatedStyle(() => {
      const isSelected = idx === selectedCardIdx;
      return {
        opacity: withTiming(isSelected ? 1 : 0.4, { duration: 200 }),
        transform: [
          { translateY: withTiming(isSelected ? 0 : 15, { duration: 200 }) },
        ],
      };
    });
  
    const cardPress = () => {
      if (settingCard !== -1) return;
      if (selectedCardIdx === idx) navigation.replace('SearchBLE');
      else {
        sliderController.goToIdx(idx);
      }
    };
    return {state: {animatedStyle}, actions: {cardPress}}
}