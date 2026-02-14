import { HeaderViewModel } from '@profile/types';
import { useNavigation } from '@react-navigation/native';

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
