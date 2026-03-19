import { View, StyleSheet, Text, Pressable } from 'react-native'
import { KakaoLogo } from '@/assets/logo'
import { DM_SANS, PRETENDARD } from '@/theme/fonts'
import { useLoginContext } from '@/contexts'
import { CheckBoxLine } from './check-box-line'
import { DARK } from '@/theme/color'
export const Footer = () => {
  const { actions, state } = useLoginContext()
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.confirmSection}>
          <CheckBoxLine
            confirm={state.allConfirm}
            confirmPress={actions.allConfirmPress}
            label="전체 동의"
            top
          />
          <View style={styles.divider} />
          <CheckBoxLine
            confirm={state.ageConfirm}
            confirmPress={actions.ageConfirmPress}
            label="만 14세 이상입니다"
            required
          />
          <CheckBoxLine
            confirm={state.termConfirm}
            confirmPress={actions.termConfirmPress}
            label="서비스 이용약관 동의"
            required
            docs="1"
          />
          <CheckBoxLine
            confirm={state.consentConfirm}
            confirmPress={actions.consentConfirmPress}
            label="개인정보 수집·이용 동의"
            required
            docs="1"
          />
          <CheckBoxLine
            confirm={state.thirdConsentConfirm}
            confirmPress={actions.thirdConsentConfirmPress}
            label="개인정보 제3자 제공 동의"
            required
            docs="1"
          />
        </View>
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
    marginBottom: 20,
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
    marginBottom: 20,
    marginHorizontal: 'auto',
    fontFamily: DM_SANS.MEDIUM,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: DARK,
  },
  confirmSection: {
    gap: 10,
    marginBottom: 20,
  },
})
