import { KakaoLogo, LogoIcon, LogoText } from '@/assets/logo';
import { useUserContext } from '@/contexts';
import { useAuthContext } from '@/contexts/auth-context';
import { UserDto } from '@/domain/user';
import { userService } from '@/services';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Pressable, Alert } from 'react-native';

export default function LoginScreen() {
  const { kakaoLogin, getKakaoProfile } = useAuthContext();
  const { setUser } = useUserContext();
  const [isPending, setPending] = useState(false);

  useEffect(() => {
    (async () => {
      const kakaoProfile = await getKakaoProfile();
      if (!kakaoProfile) return;
      const user = await userService.get(kakaoProfile.email);
      if (!user) return;
      console.log(user);
      // set user
      // go to main page
    })();
  }, []);

  const isUserDto = (dto: any): dto is UserDto => dto.id;

  const handleKakaoLoginPress = async () => {
    console.log(isPending);
    if (isPending) return;

    setPending(true);
    const kakaoProfile = await kakaoLogin();

    if (kakaoProfile) {
      const { email, nickname } = kakaoProfile;
      const user = await userService.get(email);
      if (!user) {
        const userRes = await userService.create({ id: email, nickname });
        if (!userRes) {
          Alert.alert('잠시 후 다시 시도해주세요.');
        }

        if (isUserDto(userRes)) setUser(userRes);
        console.log(user);
        // go to init page
        setPending(false);
      } else {
        console.log(user);
        setUser(user);
        setPending(false);

        // go to main page
      }
    }
    setPending(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.logoSet}>
          <LogoIcon style={styles.icon} width={170} height={200} />
          <LogoText style={styles.text} width={300} height={100} />
        </View>
      </View>
      <View style={styles.loginBtn}>
        <Pressable onPress={handleKakaoLoginPress}>
          <View style={styles.kakaoLogin}>
            <KakaoLogo style={styles.kakaoSymbol} width={30} height={30} />
            <Text style={styles.loginBtnText}>카카오로 시작하기</Text>
          </View>
        </Pressable>
      </View>
      <View style={styles.designCredit}>
        <Text style={styles.designCreditText}>Designed by Originals</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    flex: 1,
  },
  wrapper: {
    maxWidth: 400,
    flex: 1,
  },
  logoSet: {
    marginTop: 250,
    marginHorizontal: 'auto',
    alignItems: 'center',
  },
  icon: { marginLeft: 25 },
  text: {
    marginTop: 50,
  },
  loginBtn: {
    bottom: 100,
    marginHorizontal: 'auto',
    marginTop: 100,
  },
  kakaoLogin: {
    width: 300,
    height: 60,
    backgroundColor: '#fee500',
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
  loginBtnText: {
    fontWeight: 'bold',
    marginLeft: 45,
    color: '#000000ea',
    fontSize: 18,
  },
  kakaoSymbol: {
    marginLeft: 20,
  },
  designCredit: {
    bottom: 50,
    marginHorizontal: 'auto',
  },
  designCreditText: {
    color: '#3b3b3b',
  },
});
