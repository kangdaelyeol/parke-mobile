import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import '@react-native-firebase/auth';
import { UserDto } from '@/domain/user';
import { useAuthContext, useUserContext } from '@/contexts';
import cryptoJs from 'crypto-js';
import { LoginStackNavigationProp } from '@/navigation/types';
import { LoginViewModel } from '@/screens/login/types';
import { userService } from '@/services';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from '@react-native-firebase/auth';

const isUserDto = (dto: any): dto is UserDto => dto.id;

export const useLoginViewModel = (): LoginViewModel => {
  const { kakaoLogin, getKakaoProfile } = useAuthContext();
  const { setUser } = useUserContext();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<LoginStackNavigationProp>();

  useEffect(() => {
    (async () => {
      if (!navigation) return;
      setLoading(true);
      const kakaoProfile = await getKakaoProfile();
      if (!kakaoProfile) return setLoading(false);

      try {
        const password = cryptoJs
          .SHA256('parke:' + kakaoProfile.email)
          .toString();
        console.log(password);
        const res = await signInWithEmailAndPassword(
          getAuth(),
          kakaoProfile.email,
          password,
        );
        const user = await userService.get(res.user.uid);
        if (!user) return setLoading(false);

        console.log(res.user.uid);
        setUser(user);
        navigation.replace('Home');
      } catch (e: any) {
        console.log(e.code); // auth/invalid-credential
        setLoading(false);
        return;
      }
    })();
  }, [getKakaoProfile, navigation, setUser]);

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
    const password = cryptoJs.SHA256('parke:' + email).toString();
    try {
      // 첫 로그인시
      const cred = await createUserWithEmailAndPassword(
        getAuth(),
        email,
        password,
      );

      const userRes = await userService.create({ id: cred.user.uid, nickname });

      if (!isUserDto(userRes)) {
        Alert.alert('네트워크 오류: 잠시 후 다시 시도해주세요.');
        return setLoading(false);
      }

      setUser(userRes);
      return navigation.replace('Init');
    } catch (e: any) {
      if (e?.code !== 'auth/email-already-in-use') return;
      // 가입 이력이 있는 경우
      try {
        const cred = await signInWithEmailAndPassword(
          getAuth(),
          email,
          password,
        );
        const userRes = await userService.get(cred.user.uid);

        if (!isUserDto(userRes)) {
          Alert.alert('네트워크 오류: 잠시 후 다시 시도해주세요.');
          return setLoading(false);
        }
        setUser(userRes);
        navigation.replace('Home');
      } catch (err) {
        console.log(err);
        Alert.alert('로그인에 실패하였습니다. 다시 시도해주세요.');
        return;
      }
    }
  };

  return { state: { loading }, actions: { kakaoLoginPress } };
};
