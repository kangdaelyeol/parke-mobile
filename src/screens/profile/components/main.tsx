import { Pressable, StyleSheet, Text, View } from 'react-native'
import { PRETENDARD } from '@/theme/fonts'
import {
  EmailDomainInput,
  FocusableInput,
  Loading,
  PressableButton,
} from '@/components'
import { useMainViewModel } from '@profile/view-model'
import { DARK, GRAY, RED_LIGHT } from '@/theme/color'
import { formatPhone } from '@/utils'

export const Main = () => {
  const { state, actions } = useMainViewModel()
  return (
    <View>
      <View style={styles.wrapper}>
        {state.loading && <Loading />}
        <View style={styles.inputSection}>
          <FocusableInput
            title="닉네임"
            placeholder="닉네임"
            onChangeText={actions.nicknameInput}
            value={state.nickname}
            iconName="my"
          />
          <FocusableInput
            title="연락처"
            placeholder="연락처"
            onChangeText={actions.phoneInput}
            value={formatPhone(state.phone)}
            iconName="phone"
          />
          <EmailDomainInput
            title="이메일"
            value={state.email}
            onChangeText={actions.emailInput}
          />
          {!state.email && (
            <Text style={styles.emailHint}>
              카드에 이메일이 없으면 주행 기록을 보낼 때 이 주소가 미리
              채워져요.
            </Text>
          )}
        </View>
        {!!state.reportEmail && (
          <View style={styles.lastEmailRow}>
            <Text style={styles.lastEmail} numberOfLines={1}>
              이 기기에서 최근 보낸 주소: {state.reportEmail}
            </Text>
            <Pressable hitSlop={8} onPress={actions.clearReportEmailPress}>
              <Text style={styles.reportEmailDelete}>삭제</Text>
            </Pressable>
          </View>
        )}
        <View style={styles.divider} />
        <View style={styles.buttonSection}>
          <PressableButton title="저장" onPress={actions.savePress} />
          <PressableButton
            variant="secondary"
            title="로그아웃"
            onPress={actions.logoutPress}
          />
          <PressableButton
            variant="danger"
            title="회원탈퇴"
            onPress={actions.deletePress}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    flex: 1,
  },
  wrapper: {
    marginHorizontal: 'auto',
    width: '100%',
    maxWidth: 360,
    paddingHorizontal: 10,
  },
  inputSection: {
    marginTop: 20,
    gap: 15,
  },
  emailHint: {
    marginTop: -5,
    color: GRAY,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 12,
  },
  lastEmailRow: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 4,
  },
  lastEmail: {
    flex: 1,
    color: GRAY,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 12,
  },
  reportEmailDelete: {
    color: RED_LIGHT,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 14,
  },
  buttonSection: {
    gap: 15,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: DARK,
    marginVertical: 40,
  },
})
