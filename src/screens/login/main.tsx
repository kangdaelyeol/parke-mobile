import { KakaoLogo, LogoIcon, LogoText } from '@/assets/logo';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default function Login() {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.logoSet}>
          <LogoIcon style={styles.icon} width={170} height={200} />
          <LogoText style={styles.text} width={300} height={100} />
        </View>
      </View>
      <View style={styles.loginBtn}>
        <View style={styles.kakaoLogin}>
          <KakaoLogo style={styles.kakaoSymbol} width={30} height={30} />
          <Text style={styles.loginBtnText}>카카오로 시작하기</Text>
        </View>
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
