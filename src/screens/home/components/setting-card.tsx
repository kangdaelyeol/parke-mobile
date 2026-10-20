import { StyleSheet, useWindowDimensions, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSettingCardViewModel } from '@home/view-model'
import { HomeSettingCardProps } from '@home/types'
import { FOOTER_HEIGHT, FOOTER_HEIGHT_SMALL } from '@home/constants'
import {
  AccentPicker,
  LayoutSelector,
  ScaleStepper,
  ThemeSelector,
} from '@home/components'
import { FocusableInput, PressableButton } from '@/components'
import { BLUE_PRIMARY, DARK, DARK_LIGHT, GRAY_DEEP, WHITE } from '@/theme/color'
import { formatPhone } from '@/utils'

export const SettingCard = ({ card }: HomeSettingCardProps) => {
  const { state, actions, animated } = useSettingCardViewModel(card)
  const { width } = useWindowDimensions()
  const isSmall = width < 400

  return (
    <>
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
            value={formatPhone(state.phone)}
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
          <LayoutSelector value={state.layout} onChange={actions.layoutPress} />
          <ThemeSelector value={state.theme} onChange={actions.themePress} />
          <AccentPicker
            value={state.accent}
            onChangeText={actions.accentInput}
          />
          <ScaleStepper value={state.scale} onChange={actions.scaleChange} />
        </KeyboardAwareScrollView>
      </Animated.View>
      <Animated.View
        style={[
          styles.btnContainer,
          isSmall && styles.btnContainerSmall,
          animated.buttonBarStyle,
        ]}
      >
        <View style={styles.btnWrapper}>
          <PressableButton
            title="취소"
            background={[DARK, DARK_LIGHT]}
            border={[DARK_LIGHT, GRAY_DEEP]}
            text={[WHITE, WHITE]}
            onPress={actions.cancelPress}
            pressableStyle={styles.pressable}
          />
          <PressableButton
            title="저장"
            background={[BLUE_PRIMARY, '#1732ff']}
            text={[WHITE, WHITE]}
            onPress={actions.savePress}
            pressableStyle={styles.pressable}
          />
        </View>
      </Animated.View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 240,
    left: 0,
    right: 0,
    marginHorizontal: 'auto',
    bottom: 0,
  },
  wrapper: {
    width: '100%',
    maxWidth: 350,
    marginHorizontal: 'auto',
    gap: 15,
    paddingBottom: 170,
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
  // 탭 푸터와 같은 자리·높이에 놓여 수정 중에는 푸터를 대신한다
  btnContainer: {
    position: 'absolute',
    backgroundColor: DARK,
    bottom: 0,
    left: 0,
    right: 0,
    height: FOOTER_HEIGHT,
    paddingTop: 10,
    borderTopColor: '#2d2d2d',
    borderTopWidth: 1,
  },
  btnContainerSmall: {
    height: FOOTER_HEIGHT_SMALL,
    paddingTop: 5,
  },
  btnWrapper: {
    flexDirection: 'row',
    gap: 15,
    width: '100%',
    marginHorizontal: 'auto',
    maxWidth: 360,
    paddingHorizontal: 15,
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
