import { View, StyleSheet, Text, Pressable } from 'react-native'
import { AppleButton } from '@invertase/react-native-apple-authentication'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import { KakaoLogo } from '@/assets/logo'
import { useLoginContext } from '@/contexts'
import { DM_SANS, PRETENDARD } from '@/theme/fonts'
import { GRAY, GRAY_DEEP } from '@/theme/color'
import { CheckBoxLine } from '@login/components'
import { OriginalsLogoText } from '@/assets/illustrations'
export const Footer = () => {
  const { actions, state } = useLoginContext()

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Pressable
          onPress={actions.termsAndConsentConfirmPress}
          style={styles.confirmSection}
        >
          <CheckBoxLine
            label="이용약관 및 개인정보 처리 동의"
            confirm={state.allConfirm}
            confirmPress={actions.termsAndConsentConfirmPress}
          />
          <FontAwesome6
            iconStyle="solid"
            name="angle-right"
            size={12}
            color={GRAY}
            onPress={actions.termsAndConsentConfirmPress}
          />
        </Pressable>
        <View style={styles.loginSection}>
          <AppleButton
            cornerRadius={13}
            style={[
              styles.appleButton,
              !state.allConfirm && styles.loginDisabled,
            ]}
            buttonStyle={AppleButton.Style.WHITE}
            buttonType={AppleButton.Type.SIGN_IN}
            onPress={actions.appleLoginPress}
          />
          <Pressable onPress={actions.kakaoLoginPress}>
            {({ pressed }) => (
              <View
                style={[
                  styles.kakaoLogin,
                  !state.allConfirm && styles.loginDisabled,
                  state.allConfirm && pressed && styles.kakaoLoginPressed,
                ]}
              >
                <Text style={styles.loginBtnText}>카카오로 시작하기</Text>
                <KakaoLogo style={styles.kakaoSymbol} width={20} height={20} />
              </View>
            )}
          </Pressable>
        </View>
        <View style={styles.designCreditText}>
          <Text style={styles.credit}>Designed by</Text>
          <OriginalsLogoText height={7} fill="#333" style={styles.logoText} />
        </View>
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
    height: 50,
    backgroundColor: '#fee500',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kakaoLoginPressed: {
    backgroundColor: '#ffe600ab',
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
    top: 15,
    left: 90,
  },
  designCreditText: {
    marginBottom: 20,
    marginHorizontal: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
  },
  credit: {
    fontFamily: DM_SANS.MEDIUM,
    color: '#333',
  },
  confirmSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  loginSection: {
    gap: 15,
  },
  appleButton: {
    width: '100%',
    height: 50,
    marginHorizontal: 'auto',
  },
  logoText: {
    marginLeft: 3,
  },
})
