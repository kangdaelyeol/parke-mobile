import { useState } from 'react';
import { Dimensions } from 'react-native';
import { useOnBoardContext } from '@/contexts';
import { cache } from '@/storage';
import { useNavigation } from '@react-navigation/native';
import { OnBoardingStackNavigationProp } from '@/navigation/types';

export const useOnBoardingFooterController = () => {
  const navigation = useNavigation<OnBoardingStackNavigationProp>();
  const DEVICE_WIDTH = Dimensions.get('window').width;

  const [pressed, setPressed] = useState(false);

  const { sliderTranslateX, setPageIdx, pageIdx } = useOnBoardContext();

  const goToNextPage = () => {
    sliderTranslateX.value -= DEVICE_WIDTH;
    setPageIdx(prev => prev + 1);
  };

  const goToThisPage = (idx: number) => {
    sliderTranslateX.value = -DEVICE_WIDTH * idx;
    setPageIdx(idx + 1);
  };

  const goToMain = () => {
    navigation.navigate('Login');
    cache.setHasSeenOnBoarding(true);
  };

  const onBtnPressedIn = () => {
    setPressed(true);
  };

  const onBtnPressedOut = () => {
    setPressed(false);
  };

  return {
    pageIdx,
    pressed,
    onBtnPressedIn,
    onBtnPressedOut,
    goToMain,
    goToThisPage,
    goToNextPage,
  };
};
