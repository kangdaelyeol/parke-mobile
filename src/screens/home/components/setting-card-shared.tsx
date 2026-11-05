import { PropsWithChildren } from 'react'
import { StyleSheet } from 'react-native'
import Animated, {
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated'
import {
  SETTING_RANGE,
  settingSegment,
  useCardSettingContext,
  useSettingStaggerStyle,
} from '@home/contexts'
import { useTabBarLayout } from '@/hooks'
import { SCREEN_BACKGROUND } from '@/theme/color'

// 카드 수정 화면에서 두 테마가 함께 쓰는 것

// 수정 화면 요소를 순서대로 나타나게 하는 래퍼 (index가 클수록 늦게, 0번: 미리보기)
export const Stagger = ({
  index,
  fromY,
  children,
}: PropsWithChildren<{ index: number; fromY?: number }>) => {
  const style = useSettingStaggerStyle(index, fromY)
  return <Animated.View style={style}>{children}</Animated.View>
}

// 수정 화면이 열리고 닫히는 움직임
// - 배경: 카드가 투명해지는 동안 어두워지며 덮는다
// - 버튼 바: 탭바와 같은 자리·크기. 탭바가 내려가는 동안 그 자리로 올라온다
export const useSettingCardMotion = () => {
  const { settingProgress } = useCardSettingContext()
  const { height: barHeight, bottom: barBottom } = useTabBarLayout()
  const barHiddenY = barHeight + barBottom + 30

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      settingSegment(settingProgress.value, SETTING_RANGE.backdrop),
      [0, 1],
      [0, 1],
    ),
  }))
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

  return { backdropStyle, buttonBarStyle, barHeight, barBottom }
}

export const settingCardStyles = StyleSheet.create({
  // 홈 위를 전부 덮는 수정 화면
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    marginHorizontal: 'auto',
    bottom: 0,
    backgroundColor: SCREEN_BACKGROUND,
  },
  wrapper: {
    width: '100%',
    maxWidth: 350,
    marginHorizontal: 'auto',
    gap: 15,
    paddingBottom: 170,
  },
  // 취소·저장 버튼이 바를 반씩 나눠 쓴다
  pressable: {
    flex: 1,
  },
})
