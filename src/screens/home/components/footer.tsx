import { StyleSheet, useWindowDimensions, View } from 'react-native'
import Animated, {
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { FooterIcon } from '@home/components'
import {
  SETTING_RANGE,
  settingSegment,
  useCardSettingContext,
} from '@home/contexts'
import { footerIconList } from '@home/config/footer.config'
import { useTabBarLayout } from '@/hooks'
import { GLASS } from '@/theme/glass'

// 위쪽이 살짝 밝은 광택
const SHEEN =
  'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 60%, rgba(255,255,255,0) 100%)'
const BAR_PADDING = 5
const BAR_PADDING_SMALL = 4

// 화면 아래에 떠 있는 유리 탭바. 홈 · My · 설정을 오가도 그대로 남는다
export const Footer = ({ state, navigation }: BottomTabBarProps) => {
  const { settingCard, settingProgress } = useCardSettingContext()
  const { width } = useWindowDimensions()
  const { height, bottom } = useTabBarLayout()

  const isSmall = width < 400
  const isSetting = settingCard !== -1
  const padding = isSmall ? BAR_PADDING_SMALL : BAR_PADDING
  // 그림자까지 화면 밖으로 내려가도록
  const hiddenY = height + bottom + 30

  const focusedName = state.routes[state.index].name

  // 카드 수정 중에는 아래로 내려가며 숨고, 그 자리를 저장/취소 바가 대신한다
  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          settingSegment(settingProgress.value, SETTING_RANGE.footer),
          [0, 1],
          [0, hiddenY],
        ),
      },
    ],
  }))

  const onPress = (item: (typeof footerIconList)[number]) => {
    // 스캔처럼 탭이 아닌 항목은 탭바 위로 새 화면을 띄운다
    if (!item.tab) return navigation.navigate(item.key)

    const route = state.routes.find(r => r.name === item.key)
    const event = navigation.emit({
      type: 'tabPress',
      target: route?.key,
      canPreventDefault: true,
    })
    if (focusedName !== item.key && !event.defaultPrevented)
      navigation.navigate(item.key)
  }

  return (
    <Animated.View
      pointerEvents={isSetting ? 'none' : 'box-none'}
      style={[styles.container, { bottom }, containerStyle]}
    >
      <View
        style={[
          styles.bar,
          { height, padding, borderRadius: height / 2 },
          isSmall && styles.barSmall,
        ]}
      >
        {/* 보고 있는 탭은 그 칸에서 밝은 유리 알약이 150ms 동안 나타난다 (영상 사이드바 메뉴와 같은 전환) */}
        {footerIconList.map(item => (
          <FooterIcon
            iconSize={isSmall ? 19 : 22}
            key={item.key}
            iconName={item.iconName}
            label={item.label}
            active={item.key === focusedName}
            onPress={() => onPress(item)}
          />
        ))}
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  bar: {
    width: '100%',
    maxWidth: 360,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: GLASS.border,
    borderTopColor: GLASS.highlight,
    // 뒤로 패널이 지나가도 아이콘이 묻히지 않을 만큼만 비친다
    backgroundColor: 'rgba(24,24,26,0.86)',
    experimental_backgroundImage: SHEEN,
  },
  barSmall: {
    maxWidth: 330,
  },
})
