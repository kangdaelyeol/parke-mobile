import { StyleSheet, Text, View } from 'react-native'
import { FocusableInput } from '@/components'
import { useScanCompleteContext } from '@/contexts'
import { DM_SANS } from '@/theme/fonts'
import { WHITE } from '@/theme/color'

export const Step1 = () => {
  const { state, actions } = useScanCompleteContext()
  return (
    <View style={styles.container}>
      <Text style={styles.title}>기본정보를 입력해주세요!</Text>
      <FocusableInput
        title="Parke 이름"
        placeholder="Parke 이름"
        value={state.name}
        onChangeText={actions.nameInput}
        iconName="card"
      />
      <FocusableInput
        title="전화번호"
        placeholder="전화번호"
        value={state.phone}
        onChangeText={actions.phoneInput}
        iconName="phone"
      />
      <FocusableInput
        title="메시지"
        placeholder="메시지"
        value={state.message}
        onChangeText={actions.messageInput}
        iconName="message"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 15,
  },
  title: {
    color: WHITE,
    fontFamily: DM_SANS.BOLD,
    fontSize: 25,
    marginTop: 30,
  },
})
