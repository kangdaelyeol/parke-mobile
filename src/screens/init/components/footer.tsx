import { StyleSheet, Text, View } from 'react-native'
import { PressableButton } from '@/components'
import { useInitViewModel } from '@/view-model'
import {
  BLUE_PRIMARY,
  DARK,
  DARK_LIGHT,
  GRAY_DEEP,
  GRAY_LIGHT,
} from '@/theme/color'

export const Footer = () => {
  const { actions } = useInitViewModel()
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.buttonSection}>
          <PressableButton
            title="저장"
            onPress={actions.savePress}
            background={[BLUE_PRIMARY, '#272bff']}
            pressableStyle={styles.pressable}
          />
          <PressableButton
            title="건너뛰기"
            onPress={actions.skipPress}
            background={[DARK, DARK_LIGHT]}
            pressableStyle={styles.pressable}
            border={[DARK_LIGHT, GRAY_DEEP]}
            text={[GRAY_LIGHT, GRAY_LIGHT]}
          />
        </View>
        <Text style={styles.desc}>나중에 프로필에서 변경할 수 있어요</Text>
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
    maxWidth: 400,
    marginHorizontal: 'auto',
    paddingHorizontal: 20,
  },
  buttonSection: {
    flexDirection: 'row',
    marginTop: 35,
    gap: 10,
    marginBottom: 20,
  },
  inputSection: {
    marginTop: 30,
    gap: 20,
  },
  pressable: { flex: 1, flexShrink: 1, flexBasis: 0 },
  desc: {
    marginBottom: 50,
    color: GRAY_DEEP,
    textAlign: 'center',
  },
})
