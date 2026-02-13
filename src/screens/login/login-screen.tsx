import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { KakaoLogo, LogoIcon, LogoText } from '@/assets/logo';
import { Loading } from '@/components';
import { LoginStackNavigationProp } from '@/navigation/types';
import { UseLoginViewModel } from '@/view-model';

export default function LoginScreen({
  navigation,
}: {
  navigation: LoginStackNavigationProp;
}) {
  const { state, actions } = UseLoginViewModel({ navigation });

  return (
    <View style={styles.container}>
      {state.loading && <Loading />}
      <View style={styles.wrapper}>
        <View style={styles.logoSet}>
          <LogoIcon style={styles.icon} width={170} height={200} />
          <LogoText style={styles.text} width={300} height={100} />
        </View>
      </View>
      <View style={styles.loginBtn}>
        <Pressable onPress={actions.kakaoLoginPress}>
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
