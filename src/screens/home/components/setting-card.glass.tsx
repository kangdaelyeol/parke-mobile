import { StyleSheet, Text, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
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
import {
  EmailDomainInput,
  FocusableInput,
  GlassSurface,
  PressableButton,
} from '@/components'
import { GLASS_LAYOUT, glassStyles, glassText } from '@/theme/glass'
import { useIsSmallScreen } from '@/theme/layout'
import { formatPhone } from '@/utils'

// 카드 수정 화면 (글래스): 입력 이름이 배경에 떠 있지 않게 판 세 개(미리보기 · 카드 정보 · 카드 디자인)로 묶고,
// 아래에는 탭바 자리에 떠 있는 유리 캡슐 버튼 바
export const GlassSettingCard = ({ card }: HomeSettingCardProps) => {
  const { state, actions } = useSettingCardViewModel(card)
  const { settingOpened } = useCardSettingContext()
  const { backdropStyle, buttonBarStyle, barHeight, barBottom } =
    useSettingCardMotion()
  const isSmall = useIsSmallScreen()
  // 글래스 홈은 머리 없이 화면 전체를 덮으므로 상태 표시줄만큼 내려서 시작한다
  const { top } = useSafeAreaInsets()

  return (
    <>
      <Animated.View style={[settingCardStyles.container, backdropStyle]}>
        <KeyboardAwareScrollView
          contentContainerStyle={[
            settingCardStyles.wrapper,
            { paddingTop: top + GLASS_LAYOUT.topGap },
          ]}
          extraScrollHeight={15}
          enableOnAndroid
        >
          <Stagger index={0}>
            <GlassSurface style={styles.panel}>
              <CardWebPreview
                cardId={card.id}
                card={state.previewCard}
                active={settingOpened}
              />
            </GlassSurface>
          </Stagger>
          <Stagger index={1}>
            <GlassSurface style={styles.panel}>
              <Text style={glassText.title}>카드 정보</Text>
              <FocusableInput
                inset
                title="Parke 이름"
                placeholder="Parke 이름"
                value={state.title}
                onChangeText={actions.titleInput}
                iconName="card"
              />
              <FocusableInput
                inset
                title="전화번호"
                placeholder="전화번호"
                value={formatPhone(state.phone)}
                onChangeText={actions.phoneInput}
                iconName="phone"
              />
              <FocusableInput
                inset
                title="메시지"
                placeholder="메시지"
                value={state.message}
                onChangeText={actions.messageInput}
                iconName="message"
              />
              <EmailDomainInput
                inset
                title="운행 기록 이메일"
                value={state.email}
                onChangeText={actions.emailInput}
              />
            </GlassSurface>
          </Stagger>
          <Stagger index={2}>
            <GlassSurface style={styles.panel}>
              <Text style={glassText.title}>카드 디자인</Text>
              <LayoutSelector
                value={state.layout}
                onChange={actions.layoutPress}
              />
              <ThemeSelector
                value={state.theme}
                onChange={actions.themePress}
              />
              <AccentPicker
                value={state.accent}
                onChangeText={actions.accentInput}
              />
              <ScaleStepper
                value={state.scale}
                onChange={actions.scaleChange}
              />
            </GlassSurface>
          </Stagger>
        </KeyboardAwareScrollView>
      </Animated.View>
      {/* 탭바와 같은 자리에 떠 있는 유리 캡슐. 수정 중에는 탭바를 대신한다 */}
      <Animated.View
        pointerEvents="box-none"
        style={[styles.btnContainer, { bottom: barBottom }, buttonBarStyle]}
      >
        <View
          style={[
            glassStyles.surface,
            styles.btnBar,
            isSmall && styles.btnBarSmall,
            { height: barHeight, borderRadius: barHeight / 2 },
          ]}
        >
          <PressableButton
            variant="secondary"
            title="취소"
            onPress={actions.cancelPress}
            pressableStyle={settingCardStyles.pressable}
            style={[styles.barButton, { minHeight: barHeight - 12 }]}
          />
          <PressableButton
            title="저장"
            onPress={actions.savePress}
            pressableStyle={settingCardStyles.pressable}
            style={[styles.barButton, { minHeight: barHeight - 12 }]}
          />
        </View>
      </Animated.View>
    </>
  )
}

const styles = StyleSheet.create({
  // 수정 화면의 묶음 판
  panel: {
    padding: 16,
    gap: 14,
  },
  btnContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  btnBar: {
    width: '100%',
    maxWidth: 360,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 5,
    backgroundColor: 'rgba(24,24,26,0.86)',
  },
  btnBarSmall: {
    maxWidth: 330,
  },
  barButton: {
    borderRadius: 999,
  },
})
