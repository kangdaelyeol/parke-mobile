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
import { FOOTER_HEIGHT, FOOTER_HEIGHT_SMALL } from '@home/constants'
import {
  AccentPicker,
  CardWebPreview,
  LayoutSelector,
  ScaleStepper,
  ThemeSelector,
} from '@home/components'
import { FocusableInput, PressableButton } from '@/components'
import { DM_SANS, PRETENDARD } from '@/theme/fonts'
import {
  BLUE_PRIMARY,
  DARK,
  DARK_LIGHT,
  GRAY,
  GRAY_DEEP,
  WHITE,
} from '@/theme/color'
import { formatPhone } from '@/utils'

// 수정 화면 요소를 순서대로 나타나게 하는 래퍼 (index가 클수록 늦게)
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
  const { settingProgress } = useCardSettingContext()

  // 카드가 투명해지는 동안 배경이 어두워지며 덮는다
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      settingSegment(settingProgress.value, SETTING_RANGE.backdrop),
      [0, 1],
      [0, 1],
    ),
  }))

  // 탭 푸터가 내려가는 동안 그 자리로 올라온다
  const buttonBarStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          settingSegment(settingProgress.value, SETTING_RANGE.footer),
          [0, 1],
          [100, 0],
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
        {/* 카드 대신 어떤 카드를 수정 중인지만 보여주는 막대 (카드가 올라간 자리로 내려온다) */}
        <Stagger index={0} fromY={-12}>
          <View style={styles.editBar}>
            <View style={[styles.editDot, { backgroundColor: state.accent }]} />
            <Text style={styles.editLabel}>카드 수정</Text>
            <Text style={styles.editTitle} numberOfLines={1}>
              {state.title || card.title}
            </Text>
          </View>
        </Stagger>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.wrapper}
          extraScrollHeight={15}
          enableOnAndroid
        >
          <Stagger index={1}>
            <CardWebPreview cardId={card.id} card={previewCard} />
          </Stagger>
          <Stagger index={2}>
            <FocusableInput
              title="Parke 이름"
              placeholder="Parke 이름"
              value={state.title}
              onChangeText={actions.titleInput}
              iconName="card"
            />
          </Stagger>
          <Stagger index={3}>
            <FocusableInput
              title="전화번호"
              placeholder="전화번호"
              value={formatPhone(state.phone)}
              onChangeText={actions.phoneInput}
              iconName="phone"
            />
          </Stagger>
          <Stagger index={4}>
            <FocusableInput
              title="메시지"
              placeholder="메시지"
              value={state.message}
              onChangeText={actions.messageInput}
              iconName="message"
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
        style={[
          styles.btnContainer,
          isSmall && styles.btnContainerSmall,
          buttonBarStyle,
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
    top: 0,
    left: 0,
    right: 0,
    marginHorizontal: 'auto',
    bottom: 0,
    backgroundColor: '#000000',
  },
  editBar: {
    width: '100%',
    maxWidth: 350,
    marginHorizontal: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: DARK_LIGHT,
  },
  editDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  editLabel: {
    color: GRAY,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 13,
  },
  editTitle: {
    flex: 1,
    color: WHITE,
    fontFamily: DM_SANS.BOLD,
    fontSize: 16,
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
