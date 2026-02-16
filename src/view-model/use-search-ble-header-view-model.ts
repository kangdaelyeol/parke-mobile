import { SearchBLEHeaderViewModel } from '@/screens/search-ble/types';
import { useNavigation } from '@react-navigation/native';

export const useSearchBLEHeaderViewModel = (): SearchBLEHeaderViewModel => {
  const navigation = useNavigation();
  const backPress = () => {
    navigation.goBack();
  };

  return {
    state: {},
    actions: { backPress },
  };
};
