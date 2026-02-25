import { useAuthContext, useBleContext, useUserContext } from '@/contexts';
import { UserDto } from '@/domain/user';
import { LoginStackNavigationProp } from '@/navigation/types';
import { LoginViewModel } from '@/screens/login/types';
import { userService } from '@/services';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

const isUserDto = (dto: any): dto is UserDto => dto.id;

export const useLoginViewModel = (): LoginViewModel => {
  const { kakaoLogin, getKakaoProfile } = useAuthContext();
  const { setUser } = useUserContext();
  const {
    actions: { stopBleScan },
  } = useBleContext();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<LoginStackNavigationProp>();

  useEffect(() => {
    (async () => {
      if (!navigation) return;
      setLoading(true);
      const kakaoProfile = await getKakaoProfile();
      if (!kakaoProfile) return setLoading(false);

      const user = await userService.get(kakaoProfile.email);
      if (!user) return setLoading(false);
      setUser(user);
      navigation.replace('Home');
    })();
    stopBleScan();
  }, [getKakaoProfile, navigation, setUser, stopBleScan]);

  const kakaoLoginPress = async () => {
    if (loading) return;

    setLoading(true);
    const kakaoProfile = await kakaoLogin();

    if (kakaoProfile) {
      const { email, nickname } = kakaoProfile;
      const user = await userService.get(email);

      if (!user) {
        const userRes = await userService.create({ id: email, nickname });
        if (!userRes) {
          Alert.alert('잠시 후 다시 시도해주세요.');
          return setLoading(false);
        }

        if (isUserDto(userRes)) setUser(userRes);
        return navigation.replace('Init');
      } else {
        setUser(user);
        return navigation.replace('Home');
      }
    }
    setLoading(false);
  };

  return { state: { loading }, actions: { kakaoLoginPress } };
};
