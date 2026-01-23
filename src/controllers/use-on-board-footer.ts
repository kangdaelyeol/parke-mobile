import { useState } from 'react';
import { Dimensions } from 'react-native';
import { useOnBoard } from '@/contexts';
import { cache } from '@/storage';

export const useOnBoardFooter = () => {
  const DEVICE_WIDTH = Dimensions.get('window').width;

  const [pressed, setPressed] = useState(false);

  const { sliderTranslateX, setPageIdx, pageIdx, setHasSeenOnBoarding } =
    useOnBoard();

  const goToNextPage = () => {
    sliderTranslateX.value -= DEVICE_WIDTH;
    setPageIdx(prev => prev + 1);
  };

  const goToThisPage = (idx: number) => {
    sliderTranslateX.value = -DEVICE_WIDTH * idx;
    setPageIdx(idx + 1);
  };

  const goToMain = () => {
    setHasSeenOnBoarding(true);
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
