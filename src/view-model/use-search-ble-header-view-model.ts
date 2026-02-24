import { SearchBleStackNavigationProp } from '@/navigation/types';
import { useNavigation } from '@react-navigation/native';
import { SearchBLEHeaderViewModel } from '@search-ble/types';

export const useSearchBLEHeaderViewModel = (): SearchBLEHeaderViewModel => {
  const navigation = useNavigation<SearchBleStackNavigationProp>();
  const backPress = () => {
    navigation.goBack();
  };

  return {
    state: {},
    actions: { backPress },
  };
};
