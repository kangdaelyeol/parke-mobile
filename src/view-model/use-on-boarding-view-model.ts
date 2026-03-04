import { useEffect } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useOnBoardingContext } from '@/contexts';
import { OnBoardingStackParamList } from '@/navigation/types';
import { OnBoardingScreenViewModel } from '@on-boarding/types';
import { cacheClient } from '@/client';

export const useOnBoardingViewModel = (): OnBoardingScreenViewModel => {
  const navigation = useNavigation<NavigationProp<OnBoardingStackParamList>>();
  const { loading, setLoading } = useOnBoardingContext();

  useEffect(() => {
    const hasSeen = cacheClient.getHasSeenOnBoarding();
    if (hasSeen) navigation.navigate('Login');
    setLoading(false);
  }, [navigation, setLoading]);

  return {
    state: { loading },
    actions: {},
  };
};
