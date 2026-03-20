import { View, StyleSheet, Text, Pressable } from 'react-native'
import { KakaoLogo } from '@/assets/logo'
import { DM_SANS, PRETENDARD } from '@/theme/fonts'
import { useLoginContext } from '@/contexts'
import { CheckBoxLine } from './check-box-line'
import { DARK, GRAY, GRAY_DEEP } from '@/theme/color'
import { DocIllustration } from './illustrations'
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
            docs="terms"
          />
          <CheckBoxLine
            confirm={state.consentConfirm}
            confirmPress={actions.consentConfirmPress}
            label="개인정보 수집·이용 동의"
            required
            docs="consent"
          />
          <CheckBoxLine
            confirm={state.thirdConsentConfirm}
            confirmPress={actions.thirdConsentConfirmPress}
            label="개인정보 제3자 제공 동의"
            required
            docs="consent-third"
          />
          <View style={styles.divider} />
          <View style={styles.privacyContainer}>
            <DocIllustration size={20} />
            <Pressable
              onPress={() => actions.showDocPress('privacy')}
              style={styles.privacyTextContainer}
            >
              <Text style={styles.privacyText}>개인정보 처리방침</Text>
              <Text style={styles.privacyShowText}>보기</Text>
            </Pressable>
          </View>
        </View>
        <Pressable
          onPress={actions.kakaoLoginPress}
          style={[styles.kakaoLogin, !state.allConfirm && styles.loginDisabled]}
        >
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
  loginDisabled: {
    opacity: 0.5,
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
    gap: 13,
    marginBottom: 20,
  },
  privacyContainer: {
    paddingLeft: 6,
    flexDirection: 'row',
    gap: 6,
    marginBottom: 5,
  },
  privacyTextContainer: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  privacyText: {
    color: GRAY,
    fontFamily: DM_SANS.MEDIUM,
    fontSize: 15,
  },
  privacyShowText: {
    color: GRAY_DEEP,
    fontFamily: DM_SANS.BOLD,
    fontSize: 14,
  },
})
