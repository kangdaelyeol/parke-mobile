import { useUserContext } from '@/contexts';
import { InitStactNavigationProp } from '@/navigation/types';
import { userService } from '@/services';
import { useState } from 'react';
import { Alert } from 'react-native';

export const useInitController = (navigation: InitStactNavigationProp) => {
  const { user, setUser } = useUserContext();
  const [nickname, setNickname] = useState(user.nickname);
  const [phone, setPhone] = useState(user.phone);
  const [loading, setLoading] = useState(false);

  const handlers = {
    phoneInput: (val: string) => {
      setPhone(val.replace(/[^0-9]/gi, ''));
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
    handlers,
    nickname,
    phone,
    loading,
  };
};
