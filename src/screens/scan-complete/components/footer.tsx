import { PressableButton } from '@/components'
import { useScanCompleteContext } from '@/contexts'
import {
  BLUE_PRIMARY,
  DARK,
  DARK_LIGHT,
  GRAY,
  GRAY_DEEP,
  GRAY_LIGHT,
} from '@/theme/color'
import { StyleSheet, View } from 'react-native'

export const Footer = () => {
  const { state, actions } = useScanCompleteContext()

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        {state.currentStep !== 1 ? (
          <PressableButton
            title="다음"
            onPress={actions.nextPress}
            background={[BLUE_PRIMARY, '#1820ff']}
          />
        ) : (
          <View style={styles.buttonContainer}>
            <PressableButton
              onPress={() => actions.savePress()}
              title="저장"
              background={[BLUE_PRIMARY, '#1820ff']}
              pressableStyle={styles.button}
            />
            <PressableButton
              onPress={actions.prevPress}
              title="뒤로"
              background={[DARK, DARK_LIGHT]}
              pressableStyle={styles.button}
              text={[GRAY, GRAY_LIGHT]}
              border={[GRAY_DEEP, GRAY_LIGHT]}
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
    bottom: 30,
  },
  wrapper: {
    width: '100%',
    maxWidth: 400,
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
