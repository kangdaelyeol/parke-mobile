import { StyleSheet, Text, View } from 'react-native'
import { PressableButton } from '@/components'
import { GRAY_DEEP, SCREEN_BACKGROUND } from '@/theme/color'
import { useInitContext } from '@/screens/init/contexts'
import { CONTENT_MAX_WIDTH } from '@/theme/layout'

export const Footer = () => {
  const { actions } = useInitContext()
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.buttonSection}>
          <PressableButton
            title="저장"
            onPress={actions.savePress}
            pressableStyle={styles.pressable}
          />
          <PressableButton
            variant="secondary"
            title="건너뛰기"
            onPress={actions.skipPress}
            pressableStyle={styles.pressable}
          />
        </View>
        <Text style={styles.desc}>나중에 프로필에서 변경할 수 있어요</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: SCREEN_BACKGROUND,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  wrapper: {
    width: '100%',
    maxWidth: CONTENT_MAX_WIDTH,
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
