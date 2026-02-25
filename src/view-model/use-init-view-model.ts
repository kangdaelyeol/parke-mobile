import { useBleContext, useUserContext } from '@/contexts';
import { convertPhone } from '@/helpers';
import { InitStackNavigationProp } from '@/navigation/types';
import { InitViewModel } from '@/screens/init/types';
import { userService } from '@/services';
import { extractNumber } from '@/utils';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export const useInitViewModel = (): InitViewModel => {
  const navigation = useNavigation<InitStackNavigationProp>();
  const { user, setUser } = useUserContext();
  const [nickname, setNickname] = useState(user.nickname);
  const [phone, setPhone] = useState(user.phone);
  const [loading, setLoading] = useState(false);
  const {
    actions: { stopBleScan },
  } = useBleContext();

  useEffect(() => {
    stopBleScan();
  }, [stopBleScan]);

  const actions = {
    phoneInput: (val: string) => {
      setPhone(extractNumber(val));
    },
    nicknameInput: (val: string) => setNickname(val),

    savePress: async () => {
      setLoading(true);
      const res = userService.updateNicknameAndPhone(user.id, nickname, phone);
      setUser(prev => ({ ...prev, nickname, phone }));
      if (!res) {
        Alert.alert('오류가 발생했습니다. 다시 시도해주세요.');
        setLoading(false);
      }
      navigation.replace('Home');
    },
    skipPress: () => {
      navigation.replace('Home');
    },
  };

  return {
    actions,
    state: {
      nickname,
      phone: convertPhone(phone),
      loading,
    },
  };
};
