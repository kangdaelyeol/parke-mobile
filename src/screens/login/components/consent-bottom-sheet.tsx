import { JSX } from 'react'
import { View, StyleSheet, Text, Pressable } from 'react-native'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types'
import { useLoginContext } from '@login/contexts'
import { CheckBoxLine } from '@login/components'
import { DocIllustration } from '@login/components/illustrations'
import { DARK, GRAY_DEEP } from '@/theme/color'
import { DM_SANS } from '@/theme/fonts'
import { PressableButton } from '@/components'

const renderBackdrop = (
  props: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps,
) => (
  <BottomSheetBackdrop
    {...props}
    disappearsOnIndex={-1}
    appearsOnIndex={0}
    pressBehavior={'close'}
  />
)

export const ConsentBottomSheet = () => {
  const { actions, state } = useLoginContext()
  return (
    <BottomSheetModal
      ref={state.confirmSheetRef}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.backgroundStyle}
      handleIndicatorStyle={styles.indicatorStyle}
    >
      <BottomSheetView style={styles.container}>
        <View style={styles.wrapper}>
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
            docPress={() => actions.showDocPress('terms')}
          />
          <CheckBoxLine
            confirm={state.consentConfirm}
            confirmPress={actions.consentConfirmPress}
            label="개인정보 수집·이용 동의"
            required
            docPress={() => actions.showDocPress('consent')}
          />
          <CheckBoxLine
            confirm={state.thirdConsentConfirm}
            confirmPress={actions.thirdConsentConfirmPress}
            label="개인정보 제3자 제공 동의"
            required
            docPress={() => actions.showDocPress('consent-third')}
          />
          <CheckBoxLine
            confirm={state.locationTermsConfirm}
            confirmPress={actions.locationTermsConfirmPress}
            label="위치기반서비스 이용약관 동의"
            optional
            docPress={() => actions.showDocPress('location-terms')}
          />
          <CheckBoxLine
            confirm={state.locationConsentConfirm}
            confirmPress={actions.locationConsentConfirmPress}
            label="개인위치정보 수집·이용 동의"
            optional
            docPress={() => actions.showDocPress('location-consent')}
          />
          <Text style={styles.optionalNotice}>
            선택 항목은 주행 모드(운행일지)에만 필요하며, 동의하지 않아도
            로그인할 수 있습니다.
          </Text>
          <View style={styles.divider} />
          <View style={styles.privacyContainer}>
            <DocIllustration size={23} />
            <Pressable
              onPress={() => actions.showDocPress('privacy')}
              style={styles.privacyTextContainer}
            >
              <Text style={styles.privacyText}>개인정보 처리방침</Text>
              <Text style={styles.privacyShowText}>보기</Text>
            </Pressable>
          </View>
          <PressableButton
            onPress={actions.agreeAndContinuePress}
            title="동의하고 계속하기"
            background={['#5555ff', '#4c4cdb']}
          />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  optionalNotice: {
    color: GRAY_DEEP,
    fontFamily: DM_SANS.MEDIUM,
    fontSize: 12,
  },
  backgroundStyle: {
    backgroundColor: '#141414',
    borderTopColor: '#2a2a2a',
    borderWidth: 1,
  },
  indicatorStyle: {
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    maxHeight: 700,
  },
  wrapper: {
    width: '100%',
    maxWidth: 370,
    marginHorizontal: 'auto',
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
    color: '#2a4290',
    fontFamily: DM_SANS.BOLD,
    fontSize: 16,
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
  divider: {
    height: 1,
    backgroundColor: DARK,
  },
})
