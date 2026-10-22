import { Pressable, StyleSheet, Text, View } from 'react-native'
import { PRETENDARD } from '@/theme/fonts'
import { FocusableInput, Loading, PressableButton } from '@/components'
import { useMainViewModel } from '@profile/view-model'
import {
  DARK,
  DARK_LIGHT,
  GRAY,
  GRAY_LIGHT,
  RED,
  RED_LIGHT,
  WHITE,
} from '@/theme/color'
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
        </View>
        <View style={styles.reportEmail}>
          <Text style={styles.reportEmailTitle}>운행 기록 수신 이메일</Text>
          <View style={styles.reportEmailRow}>
            <Text style={styles.reportEmailValue} numberOfLines={1}>
              {state.reportEmail || '저장된 주소 없음'}
            </Text>
            {!!state.reportEmail && (
              <Pressable hitSlop={8} onPress={actions.clearReportEmailPress}>
                <Text style={styles.reportEmailDelete}>삭제</Text>
              </Pressable>
            )}
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.buttonSection}>
          <PressableButton
            title="저장"
            onPress={actions.savePress}
            background={['#3B3BF9', '#4b4bff']}
          />
          <PressableButton
            title="로그아웃"
            onPress={actions.logoutPress}
            background={[DARK, DARK]}
            text={[GRAY_LIGHT, WHITE]}
            border={[DARK_LIGHT, GRAY]}
          />
          <PressableButton
            title="회원탈퇴"
            onPress={actions.deletePress}
            border={[RED, RED_LIGHT]}
            text={[RED, RED_LIGHT]}
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
  reportEmail: {
    marginTop: 24,
    gap: 10,
  },
  reportEmailTitle: {
    color: GRAY,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 13,
  },
  reportEmailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 55,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DARK_LIGHT,
    backgroundColor: DARK,
  },
  reportEmailValue: {
    flex: 1,
    color: WHITE,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 16,
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
