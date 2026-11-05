import { StyleSheet, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSettingCardViewModel } from '@home/view-model'
import { HomeSettingCardProps } from '@home/types'
import { useCardSettingContext } from '@home/contexts'
import { AccentPicker } from './accent-picker'
import { CardWebPreview } from './card-web-preview'
import { LayoutSelector } from './layout-selector'
import { ScaleStepper } from './scale-stepper'
import { ThemeSelector } from './theme-selector'
import {
  Stagger,
  settingCardStyles,
  useSettingCardMotion,
} from './setting-card-shared'
import { EmailDomainInput, FocusableInput, PressableButton } from '@/components'
import { DARK } from '@/theme/color'
import { useIsSmallScreen } from '@/theme/layout'
import { formatPhone } from '@/utils'

// 카드 수정 화면 (기본 테마: 처음 디자인). 항목이 한 줄씩 차례로 나타나고, 아래에 붙은 어두운 버튼 바
export const ClassicSettingCard = ({ card }: HomeSettingCardProps) => {
  const { state, actions } = useSettingCardViewModel(card)
  const { settingOpened } = useCardSettingContext()
  const { backdropStyle, buttonBarStyle, barHeight } = useSettingCardMotion()
  const isSmall = useIsSmallScreen()

  return (
    <>
      <Animated.View style={[settingCardStyles.container, backdropStyle]}>
        <KeyboardAwareScrollView
          contentContainerStyle={settingCardStyles.wrapper}
          extraScrollHeight={15}
          enableOnAndroid
        >
          <Stagger index={0}>
            <CardWebPreview
              cardId={card.id}
              card={state.previewCard}
              active={settingOpened}
            />
          </Stagger>
          <Stagger index={1}>
            <FocusableInput
              title="Parke 이름"
              placeholder="Parke 이름"
              value={state.title}
              onChangeText={actions.titleInput}
              iconName="card"
            />
          </Stagger>
          <Stagger index={2}>
            <FocusableInput
              title="전화번호"
              placeholder="전화번호"
              value={formatPhone(state.phone)}
              onChangeText={actions.phoneInput}
              iconName="phone"
            />
          </Stagger>
          <Stagger index={3}>
            <FocusableInput
              title="메시지"
              placeholder="메시지"
              value={state.message}
              onChangeText={actions.messageInput}
              iconName="message"
            />
          </Stagger>
          <Stagger index={4}>
            <EmailDomainInput
              title="운행 기록 이메일"
              value={state.email}
              onChangeText={actions.emailInput}
            />
          </Stagger>
          <Stagger index={5}>
            <LayoutSelector
              value={state.layout}
              onChange={actions.layoutPress}
            />
          </Stagger>
          <Stagger index={6}>
            <ThemeSelector value={state.theme} onChange={actions.themePress} />
          </Stagger>
          <Stagger index={7}>
            <AccentPicker
              value={state.accent}
              onChangeText={actions.accentInput}
            />
          </Stagger>
          <Stagger index={8}>
            <ScaleStepper value={state.scale} onChange={actions.scaleChange} />
          </Stagger>
        </KeyboardAwareScrollView>
      </Animated.View>
      {/* 탭바 자리에 붙은 어두운 바 */}
      <Animated.View
        style={[styles.btnContainer, { height: barHeight }, buttonBarStyle]}
      >
        <View style={[styles.btnWrapper, isSmall && styles.btnWrapperSmall]}>
          <PressableButton
            variant="secondary"
            title="취소"
            onPress={actions.cancelPress}
            pressableStyle={settingCardStyles.pressable}
          />
          <PressableButton
            title="저장"
            onPress={actions.savePress}
            pressableStyle={settingCardStyles.pressable}
          />
        </View>
      </Animated.View>
    </>
  )
}

const styles = StyleSheet.create({
  btnContainer: {
    position: 'absolute',
    backgroundColor: DARK,
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 10,
    borderTopColor: '#2d2d2d',
    borderTopWidth: 1,
  },
  btnWrapper: {
    flexDirection: 'row',
    gap: 15,
    width: '100%',
    marginHorizontal: 'auto',
    maxWidth: 360,
    paddingHorizontal: 15,
  },
  btnWrapperSmall: {
    marginTop: -5,
  },
})
