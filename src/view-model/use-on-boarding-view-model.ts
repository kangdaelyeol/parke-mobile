import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useOnBoardingContext } from '@/contexts';
import { OnBoardingStackNavigationProp } from '@/navigation/types';
import { OnBoardingScreenViewModel } from '@on-boarding/types';
import { cacheService } from '@/services';

export const useOnBoardingViewModel = (): OnBoardingScreenViewModel => {
  const navigation = useNavigation<OnBoardingStackNavigationProp>();
  const { loading, setLoading } = useOnBoardingContext();

  useEffect(() => {
    const hasSeen = cacheService.getHasSeenOnBoarding();
    if (hasSeen) navigation.navigate('Login');
    setLoading(false);
  }, [navigation, setLoading]);

  return {
    state: { loading },
    actions: {},
  };
};
