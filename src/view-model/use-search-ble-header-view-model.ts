import { SearchBleStackNavigationProp } from '@/navigation/types';
import { useNavigation } from '@react-navigation/native';
import { SearchBleHeaderViewModel } from '@search-ble/types';

export const useSearchBleHeaderViewModel = (): SearchBleHeaderViewModel => {
  const navigation = useNavigation<SearchBleStackNavigationProp>();
  const backPress = () => {
    navigation.goBack();
  };

  return {
    state: {},
    actions: { backPress },
  };
};
