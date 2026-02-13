import { useAuthContext, useUserContext } from '@/contexts';
import { UserDto } from '@/domain/user';
import { LoginStackNavigationProp } from '@/navigation/types';
import { LoginViewModel } from '@/screens/login/types';
import { userService } from '@/services';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

interface UseLoginControllerProps {
  navigation: LoginStackNavigationProp;
}

const isUserDto = (dto: any): dto is UserDto => dto.id;

export const UseLoginViewModel = ({
  navigation,
}: UseLoginControllerProps): LoginViewModel => {
  const { kakaoLogin, getKakaoProfile } = useAuthContext();
  const { setUser } = useUserContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const kakaoProfile = await getKakaoProfile();
      if (!kakaoProfile) return setLoading(false);
      const user = await userService.get(kakaoProfile.email);
      if (!user) return setLoading(false);
      setUser(user);
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    })();
  }, [getKakaoProfile, navigation, setUser]);

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
        return navigation.reset({
          index: 0,
          routes: [{ name: 'Init' }],
        });
      } else {
        setUser(user);
        return navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }
    }
    setLoading(false);
  };

  return { state: { loading }, actions: { kakaoLoginPress } };
};
