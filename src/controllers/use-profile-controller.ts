import { useUserContext } from '@/contexts';
import { ProfileStackNavigationProp } from '@/navigation/types';
import { userService } from '@/services';
import { logout } from '@react-native-seoul/kakao-login';
import { useState } from 'react';
import { Alert } from 'react-native';

export const useProfileController = (
  navigation: ProfileStackNavigationProp,
) => {
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
      if (!res) {
        Alert.alert('오류가 발생했습니다. 다시 시도해주세요.');
        return setLoading(false);
      }
      setUser(prev => ({
        ...prev,
        nickname,
        phone,
      }));
      navigation.goBack();
    },
    backPress: () => {
      navigation.goBack();
    },
    logoutPress: async () => {
      Alert.alert('Logout', '로그아웃 하시겠습니까?', [
        {
          text: '예',
          onPress: async () => {
            setLoading(true);
            try {
              await logout();
              return navigation.replace('Login');
            } catch (e) {
              Alert.alert('오류가 발생했습니다. 다시 시도해주세요.');
              return setLoading(false);
            }
          },
        },
        {
          text: '아니오',
          style: 'cancel',
        },
      ]);
    },
    deletePress: async () => {
      Alert.alert('Delete User', '회원탈퇴 하시겠습니까?', [
        {
          text: '예',
          onPress: async () => {
            try {
              setLoading(true);
              const res = await userService.delete(user.id);
              if (res) return navigation.replace('Login');
              Alert.alert('오류가 발생했습니다. 다시 시도해주세요.');
              return setLoading(false);
            } catch (e) {
              Alert.alert('오류가 발생했습니다. 다시 시도해주세요.');
              return setLoading(false);
            }
          },
        },
        { text: '아니오', style: 'cancel' },
      ]);
    },
  };

  return {
    handlers,
    nickname,
    phone,
    loading,
  };
};
