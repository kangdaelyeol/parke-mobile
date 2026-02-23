import { useNavigation } from '@react-navigation/native';
import { HeaderViewModel } from '@profile/types';

export const useProfileHeaderViewModel = (): HeaderViewModel => {
  const navigation = useNavigation();

  const actions = {
    backPress: () => {
      navigation.goBack();
    },
  };
  return {
    state: {},
    actions,
  };
};
