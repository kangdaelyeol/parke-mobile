import { useNavigation } from '@react-navigation/native';
import { SettingHeaderViewModel } from '@setting/types';
import { SettingStackNavigationProp } from '@/navigation/types';

export const useSettingHeaderViewModel = (): SettingHeaderViewModel => {
  const navigation = useNavigation<SettingStackNavigationProp>();

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
