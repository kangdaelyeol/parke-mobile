import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { HomeStackNavigationProp } from '@/navigation/types';
import { useCardSettingContext, useCardSliderContext } from '@/contexts';
import { CardViewModel } from '@home/types';
import { useEffect } from 'react';

export const useHomeEmptyCardViewModel = (idx: number): CardViewModel => {
  const navigation = useNavigation<HomeStackNavigationProp>();
  const { selectedCardIdx, sliderController } = useCardSliderContext();
  const { settingCard } = useCardSettingContext();
  const isSelected = idx === selectedCardIdx;

  const cardOpacity = useSharedValue(isSelected ? 1 : 0);
  const cardTranslateY = useSharedValue(isSelected ? 1 : 0);

  useEffect(() => {
    cardOpacity.value = withTiming(isSelected ? 1 : 0, { duration: 200 });
    cardTranslateY.value = isSelected ? 1 : 0;
  }, [cardOpacity, cardTranslateY, isSelected]);

  const cardStyle = useAnimatedStyle(() => {
    return {
      opacity: cardOpacity.value * 0.6 + 0.4,
      transform: [{ translateY: (1 - cardTranslateY.value) * 15 }],
    };
  });

  const cardPress = () => {
    if (settingCard !== -1) return;
    if (selectedCardIdx === idx) navigation.navigate('SearchBLE');
    else {
      sliderController.goToIdx(idx);
    }
  };
  return { state: {}, animated: { cardStyle }, actions: { cardPress } };
};
