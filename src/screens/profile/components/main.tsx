import { StyleSheet, View } from 'react-native'
import { FocusableInput, Loading, PressableButton } from '@/components'
import { useMainViewModel } from '@/view-model/profile'
import {
  DARK,
  DARK_LIGHT,
  GRAY,
  GRAY_LIGHT,
  RED,
  RED_LIGHT,
  WHITE,
} from '@/theme/color'

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
            value={state.phone}
            iconName="phone"
          />
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
  },
  inputSection: {
    marginTop: 20,
    gap: 15,
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
