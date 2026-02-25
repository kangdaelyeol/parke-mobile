import { useEffect } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useOnBoardingContext } from '@/contexts';
import { OnBoardingStackParamList } from '@/navigation/types';
import { ScreenViewModel } from '@on-boarding/types';
import { cache } from '@/storage';

export const useOnBoardingViewModel = (): ScreenViewModel => {
  const navigation = useNavigation<NavigationProp<OnBoardingStackParamList>>();
  const { loading, setLoading } = useOnBoardingContext();

  useEffect(() => {
    const hasSeen = cache.getHasSeenOnBoarding();
    if (hasSeen) navigation.navigate('Login');
    setLoading(false);
  }, [navigation, setLoading]);

  return {
    state: { loading },
    actions: {},
  };
};
