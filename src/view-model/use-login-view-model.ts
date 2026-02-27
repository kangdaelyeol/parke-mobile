import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import '@react-native-firebase/auth';
import { UserDto } from '@/domain/user';
import { useAuthContext, useUserContext } from '@/contexts';
import { LoginStackNavigationProp } from '@/navigation/types';
import { LoginViewModel } from '@/screens/login/types';
import { userService } from '@/services';
import { getHashedPassword } from '@/helpers';

const isUserDto = (dto: any): dto is UserDto => dto.id;

export const useLoginViewModel = (): LoginViewModel => {
  const { kakaoLogin, getKakaoProfile, firebaseLogin, firebaseSignIn } =
    useAuthContext();
  const { setUser } = useUserContext();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<LoginStackNavigationProp>();

  useEffect(() => {
    (async () => {
      if (!navigation) return;
      setLoading(true);
      const kakaoProfile = await getKakaoProfile();
      if (!kakaoProfile) return setLoading(false);

      const password = getHashedPassword(kakaoProfile.email);
      const uid = await firebaseLogin(kakaoProfile.email, password);
      if (!uid) return setLoading(false);

      const user = await userService.get(uid);
      if (!user) return setLoading(false);

      setUser(user);
      navigation.replace('Home');
    })();
  }, [getKakaoProfile, navigation, setUser, firebaseLogin]);

  const kakaoLoginPress = async () => {
    if (loading) return;

    setLoading(true);
    const kakaoProfile = await kakaoLogin();

    if (!kakaoProfile) {
      Alert.alert(
        '카카오 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.',
      );
      return setLoading(false);
    }

    const { email, nickname } = kakaoProfile;

    // 첫 로그인시 - 가입
    const password = getHashedPassword(email);
    const uid = await firebaseSignIn(email, password);

    if (!uid) {
      // 계정이 존재하는 경우
      const firebaseUid = await firebaseLogin(email, password);

      if (!firebaseUid) {
        Alert.alert('로그인에 실패하였습니다. 다시 시도해주세요.');
        setLoading(false);
        return;
      }

      const userRes = await userService.get(firebaseUid);

      if (!isUserDto(userRes)) {
        Alert.alert('네트워크 오류: 잠시 후 다시 시도해주세요.');
        return setLoading(false);
      }

      setUser(userRes);
      return navigation.replace('Home');
    }

    const userRes = await userService.create({ id: uid, nickname });

    if (!isUserDto(userRes)) {
      Alert.alert('네트워크 오류: 잠시 후 다시 시도해주세요.');
      return setLoading(false);
    }

    setUser(userRes);
    return navigation.replace('Init');
  };

  return { state: { loading }, actions: { kakaoLoginPress } };
};
