import { Dimensions } from 'react-native';
import { useOnBoardingContext } from '@/contexts';
import { useNavigation } from '@react-navigation/native';
import { OnBoardingStackNavigationProp } from '@/navigation/types';
import { OnBoardingFooterViewModel } from '@on-boarding/types';
import { cacheService } from '@/services';

export const useOnBoardingFooterViewModel = (): OnBoardingFooterViewModel => {
  const navigation = useNavigation<OnBoardingStackNavigationProp>();
  const DEVICE_WIDTH = Dimensions.get('window').width;

  const { sliderTranslateX, setPageIdx, pageIdx } = useOnBoardingContext();

  const actions = {
    nextPress: () => {
      sliderTranslateX.value -= DEVICE_WIDTH;
      setPageIdx(prev => prev + 1);
    },
    dotPress: (idx: number) => {
      sliderTranslateX.value = -DEVICE_WIDTH * idx;
      setPageIdx(idx + 1);
    },
    startPress: () => {
      navigation.navigate('Permission');
      cacheService.setHasSeenOnBoarding(true);
    },
  };

  const state = {
    pageIdx,
  };

  return {
    state,
    actions,
  };
};
