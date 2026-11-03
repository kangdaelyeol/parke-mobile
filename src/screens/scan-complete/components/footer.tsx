import { PressableButton } from '@/components'
import { useScanCompleteContext } from '@scan-complete/contexts'
import { StyleSheet, View } from 'react-native'

export const Footer = () => {
  const { state, actions } = useScanCompleteContext()

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        {state.currentStep !== 1 ? (
          <PressableButton title="다음" onPress={actions.verifyPress} />
        ) : (
          <View style={styles.buttonContainer}>
            <PressableButton
              onPress={() => actions.savePress()}
              title="저장"
              pressableStyle={styles.button}
            />
            <PressableButton
              onPress={actions.prevPress}
              variant="secondary"
              title="뒤로"
              pressableStyle={styles.button}
            />
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
    zIndex: 1,
  },
  wrapper: {
    width: '100%',
    maxWidth: 400,
    paddingBottom: 30,
    marginHorizontal: 'auto',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  button: {
    flex: 1,
  },
})
