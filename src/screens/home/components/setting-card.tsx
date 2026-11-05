import { PropsWithChildren, useMemo } from 'react'
import { StyleSheet, useWindowDimensions, View } from 'react-native'
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
import { EmailDomainInput, FocusableInput, PressableButton } from '@/components'
import { glassStyles } from '@/theme/glass'
import { useTabBarLayout } from '@/hooks'
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

  // 탭바와 같은 자리·크기의 유리 바. 탭바가 내려가는 동안 그 자리로 올라온다
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
    </>
  )
}

const styles = StyleSheet.create({
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
