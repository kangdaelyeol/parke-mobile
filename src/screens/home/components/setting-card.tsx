import { PropsWithChildren, useMemo } from 'react'
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import Animated, {
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSettingCardViewModel } from '@home/view-model'
import { HomeSettingCardProps } from '@home/types'
import {
  SETTING_RANGE,
  settingSegment,
  useCardSettingContext,
  useSettingStaggerStyle,
} from '@home/contexts'
import {
  AccentPicker,
  CardWebPreview,
  LayoutSelector,
  ScaleStepper,
  ThemeSelector,
} from '@home/components'
import {
  EmailDomainInput,
  FocusableInput,
  GlassSurface,
  PressableButton,
} from '@/components'
import { glassStyles, glassText } from '@/theme/glass'
import { useTabBarLayout } from '@/hooks'
import { useThemeId } from '@/theme/themed'
import { DARK } from '@/theme/color'
import { formatPhone } from '@/utils'

// 수정 화면 요소를 순서대로 나타나게 하는 래퍼 (index가 클수록 늦게, 0번: 미리보기)
const Stagger = ({
  index,
  fromY,
  children,
}: PropsWithChildren<{ index: number; fromY?: number }>) => {
  const style = useSettingStaggerStyle(index, fromY)
  return <Animated.View style={style}>{children}</Animated.View>
}

export const SettingCard = ({ card }: HomeSettingCardProps) => {
  const { state, actions } = useSettingCardViewModel(card)
  const { width } = useWindowDimensions()
  const isSmall = width < 400
  const { settingProgress, settingOpened } = useCardSettingContext()

  // 카드가 투명해지는 동안 배경이 어두워지며 덮는다
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      settingSegment(settingProgress.value, SETTING_RANGE.backdrop),
      [0, 1],
      [0, 1],
    ),
  }))

  // 탭바와 같은 자리·크기의 바. 탭바가 내려가는 동안 그 자리로 올라온다
  const isGlass = useThemeId() === 'glass-dashboard'
  const { height: barHeight, bottom: barBottom } = useTabBarLayout()
  const barHiddenY = barHeight + barBottom + 30
  const buttonBarStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          settingSegment(settingProgress.value, SETTING_RANGE.footer),
          [0, 1],
          [barHiddenY, 0],
        ),
      },
    ],
  }))
  // 수정 중인 값을 그대로 미리보기에 넘긴다 (값이 바뀔 때만 새 객체)
  const previewCard = useMemo(
    () => ({
      title: state.title,
      phone: state.phone,
      theme: state.theme,
      layout: state.layout,
      custom: {
        accent: state.accent,
        scale: state.scale,
        message: state.message,
      },
    }),
    [
      state.title,
      state.phone,
      state.theme,
      state.layout,
      state.accent,
      state.scale,
      state.message,
    ],
  )

  return (
    <>
      <Animated.View style={[styles.container, backdropStyle]}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.wrapper}
          extraScrollHeight={15}
          enableOnAndroid
        >
          {isGlass ? (
            <>
              {/* 글래스: 입력 이름이 배경에 떠 있지 않게 판 세 개(미리보기 · 카드 정보 · 카드 디자인)로 묶는다 */}
              <Stagger index={0}>
                <GlassSurface style={styles.panel}>
                  <CardWebPreview
                    cardId={card.id}
                    card={previewCard}
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
            </>
          ) : (
            // 기본 테마: 한 줄씩 차례로 (처음 디자인)
            <>
              <Stagger index={0}>
                <CardWebPreview
                  cardId={card.id}
                  card={previewCard}
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
                <ThemeSelector
                  value={state.theme}
                  onChange={actions.themePress}
                />
              </Stagger>
              <Stagger index={7}>
                <AccentPicker
                  value={state.accent}
                  onChangeText={actions.accentInput}
                />
              </Stagger>
              <Stagger index={8}>
                <ScaleStepper
                  value={state.scale}
                  onChange={actions.scaleChange}
                />
              </Stagger>
            </>
          )}
        </KeyboardAwareScrollView>
      </Animated.View>
      {isGlass ? (
        // 글래스: 탭바와 같은 자리에 떠 있는 유리 캡슐
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
              pressableStyle={styles.pressable}
              style={[styles.barButton, { minHeight: barHeight - 12 }]}
            />
            <PressableButton
              title="저장"
              onPress={actions.savePress}
              pressableStyle={styles.pressable}
              style={[styles.barButton, { minHeight: barHeight - 12 }]}
            />
          </View>
        </Animated.View>
      ) : (
        // 기본 테마: 탭바 자리에 붙은 어두운 바 (처음 디자인)
        <Animated.View
          style={[classic.btnContainer, { height: barHeight }, buttonBarStyle]}
        >
          <View
            style={[classic.btnWrapper, isSmall && classic.btnWrapperSmall]}
          >
            <PressableButton
              variant="secondary"
              title="취소"
              onPress={actions.cancelPress}
              pressableStyle={styles.pressable}
            />
            <PressableButton
              title="저장"
              onPress={actions.savePress}
              pressableStyle={styles.pressable}
            />
          </View>
        </Animated.View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  // 글래스: 수정 화면의 묶음 판
  panel: {
    padding: 16,
    gap: 14,
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    marginHorizontal: 'auto',
    bottom: 0,
    backgroundColor: '#000000',
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
  // 탭바와 같은 자리에 떠 있는 유리 바. 수정 중에는 탭바를 대신한다
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

// 기본 테마 (처음 디자인)
const classic = StyleSheet.create({
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
