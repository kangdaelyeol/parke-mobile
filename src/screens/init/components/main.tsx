import { StyleSheet, View } from 'react-native'
import { FocusableInput } from '@/components'
import { useInitViewModel } from '@/view-model'

export const Main = () => {
  const { state, actions } = useInitViewModel()
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View>
          <View style={styles.inputSection}>
            <FocusableInput
              title="닉네임"
              value={state.nickname}
              onChangeText={actions.nicknameInput}
              placeholder="닉네임"
              iconName="my"
            />
            <FocusableInput
              title="연락처"
              placeholder="연락처"
              value={state.phone}
              onChangeText={actions.phoneInput}
              iconName="phone"
            />
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  wrapper: {
    width: '100%',
    maxWidth: 400,
    marginHorizontal: 'auto',
    paddingHorizontal: 20,
  },
  inputSection: {
    marginTop: 30,
    gap: 20,
  },
  buttonSection: {
    flexDirection: 'row',
    marginTop: 35,
    gap: 35,
  },
  pressable: { flex: 1, flexShrink: 1, flexBasis: 0 },
})
