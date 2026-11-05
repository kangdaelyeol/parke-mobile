import { StyleSheet, useWindowDimensions, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { useFooterViewModel } from '@home/view-model'
import { footerIconList } from '@home/config/footer.config'
import { useTabBarLayout } from '@/hooks'
import { GLASS } from '@/theme/glass'
import { GlassFooterIcon } from './footer-icon.glass'

// 위쪽이 살짝 밝은 광택
const SHEEN =
  'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 60%, rgba(255,255,255,0) 100%)'
const BAR_PADDING = 5
const BAR_PADDING_SMALL = 4

// 화면 아래에 떠 있는 유리 탭바. 홈 · My · 설정을 오가도 그대로 남는다
export const GlassFooter = ({ state, navigation }: BottomTabBarProps) => {
  const vm = useFooterViewModel({ state, navigation })
  const { width } = useWindowDimensions()
  const { height, bottom } = useTabBarLayout()
  const isSmall = width < 400
  const padding = isSmall ? BAR_PADDING_SMALL : BAR_PADDING

  return (
    <Animated.View
      pointerEvents={vm.state.isSetting ? 'none' : 'box-none'}
      style={[styles.container, { bottom }, vm.animated.containerStyle]}
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
          <GlassFooterIcon
            iconSize={isSmall ? 19 : 22}
            key={item.key}
            iconName={item.iconName}
            label={item.label}
            active={item.key === vm.state.focusedName}
            onPress={() => vm.actions.itemPress(item)}
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
