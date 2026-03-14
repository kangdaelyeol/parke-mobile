import { View, StyleSheet, Text, Pressable } from 'react-native'
import { KakaoLogo } from '@/assets/logo'
import { useLoginViewModel } from '@/view-model'
import { DM_SANS, PRETENDARD } from '@/theme/fonts'
export const Footer = () => {
  const { actions } = useLoginViewModel()
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Pressable onPress={actions.kakaoLoginPress} style={styles.kakaoLogin}>
          <View>
            <Text style={styles.loginBtnText}>카카오로 시작하기</Text>
            <KakaoLogo style={styles.kakaoSymbol} width={20} height={20} />
          </View>
        </Pressable>
        <Text style={styles.designCreditText}>Designed by Originals</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  wrapper: {
    width: '100%',
    maxWidth: 360,
    marginHorizontal: 'auto',
  },
  kakaoLogin: {
    bottom: 75,
    marginHorizontal: 'auto',
    width: '100%',
    height: 60,
    backgroundColor: '#fee500',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtnText: {
    fontFamily: PRETENDARD.BOLD,
    color: '#000000ea',
    fontSize: 17,
  },
  kakaoSymbol: {
    position: 'absolute',
    top: 2,
    left: -35,
  },
  designCreditText: {
    bottom: 50,
    marginHorizontal: 'auto',
    fontFamily: DM_SANS.MEDIUM,
    color: '#333',
  },
})
