import { logout } from '@react-native-seoul/kakao-login';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert } from 'react-native';
import { useUserContext } from '@/contexts';
import { convertPhone } from '@/helpers';
import { ProfileStackNavigationProp } from '@/navigation/types';
import { userService } from '@/services';
import { extractNumber } from '@/utils';

export const useProfileMainViewModel = () => {
  const { user, setUser } = useUserContext();
  const [nickname, setNickname] = useState(user.nickname);
  const [phone, setPhone] = useState(user.phone);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<ProfileStackNavigationProp>();

  const actions = {
    phoneInput: (val: string) => {
      setPhone(extractNumber(val));
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

    logoutPress: async () => {
      Alert.alert('Logout', '로그아웃 하시겠습니까?', [
        {
          text: '예',
          onPress: async () => {
            setLoading(true);
            try {
              await logout();
              return navigation.navigate('Login');
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
    state: {
      loading,
      nickname,
      phone: convertPhone(phone),
    },
    actions: actions,
  };
};
