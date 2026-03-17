import { StyleSheet, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSettingCardViewModel } from '@/view-model/home'
import { HomeSettingCardProps } from '@home/types'
import { FocusableInput, PressableButton } from '@/components'
import { BLUE_PRIMARY, DARK, DARK_LIGHT, GRAY_DEEP, WHITE } from '@/theme/color'

export const SettingCard = ({ card }: HomeSettingCardProps) => {
  const { state, actions, animated } = useSettingCardViewModel(card)

  return (
    <Animated.View style={[styles.container, animated.optionStyle]}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.wrapper}
        extraScrollHeight={15}
        enableOnAndroid
      >
        <FocusableInput
          title="Parke 이름"
          placeholder="Parke 이름"
          value={state.title}
          onChangeText={actions.titleInput}
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
      </KeyboardAwareScrollView>
      <View style={styles.btnContainer}>
        <View style={styles.btnWrapper}>
          <PressableButton
            title="저장"
            background={[BLUE_PRIMARY, '#1732ff']}
            text={[WHITE, WHITE]}
            onPress={actions.savePress}
            pressableStyle={styles.pressable}
          />
          <PressableButton
            title="취소"
            background={[DARK, DARK_LIGHT]}
            border={[DARK_LIGHT, GRAY_DEEP]}
            text={[WHITE, WHITE]}
            onPress={actions.cancelPress}
            pressableStyle={styles.pressable}
          />
        </View>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 240,
    left: 0,
    right: 0,
    marginHorizontal: 'auto',
    marginTop: 0,
    bottom: 0,
  },
  wrapper: {
    width: '100%',
    maxWidth: 350,
    marginHorizontal: 'auto',
    gap: 15,
  },
  text: {
    color: '#eaeaea',
    fontWeight: 'bold',
    fontSize: 18,
  },
  input: {
    height: 40,
    fontSize: 15,
    backgroundColor: '#18171f',
    color: 'white',
    borderRadius: 10,
    marginTop: 8,
    paddingHorizontal: 10,
    fontWeight: 'bold',
  },
  btnContainer: {
    position: 'absolute',
    bottom: 110,
    left: 0,
    right: 0,
  },
  btnWrapper: {
    flexDirection: 'row',
    gap: 15,
    width: '100%',
    marginHorizontal: 'auto',
    maxWidth: 360,
  },
  btn: {
    paddingVertical: 20,
    fontSize: 25,
    textAlign: 'center',
    borderRadius: 10,
    fontWeight: 'bold',
  },
  pressable: {
    flex: 1,
  },
})
