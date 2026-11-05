import { Pressable, StyleSheet, View } from 'react-native'
import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { HomeFooterIconProps } from '@home/types'
import { useSelectionProgress } from '@/components'
import { DM_SANS } from '@/theme/fonts'
import { GLASS, glassStyles, TEXT, TONE } from '@/theme/glass'
import { FooterGlyph } from './footer-glyph'
import { useIsSmallScreen } from '@/theme/layout'

// 흐린 아이콘의 밝기
const IDLE_ICON_OPACITY = 0.5

// 글래스 탭바 한 칸 (영상 사이드바 메뉴).
// 보고 있는 탭: 밝은 유리 알약 + 강조색 아이콘이 150ms 동안 교차해 나타난다. 나머지는 흐리게.
// 누르는 동안 칸 전체에 옅은 알약이 깔린다
export const GlassFooterIcon = ({
  label,
  iconName,
  active,
  onPress,
  iconSize,
}: HomeFooterIconProps) => {
  const isSmall = useIsSmallScreen()
  const selected = useSelectionProgress(active)

  const activeStyle = useAnimatedStyle(() => ({ opacity: selected.value }))
  const idleIconStyle = useAnimatedStyle(() => ({
    opacity: (1 - selected.value) * IDLE_ICON_OPACITY,
  }))
  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      selected.value,
      [0, 1],
      [TEXT.tertiary, TEXT.primary],
    ),
  }))

  return (
    <Pressable onPress={onPress} style={styles.pressable}>
      {({ pressed }) => (
        <View style={[styles.container, pressed && !active && styles.pressed]}>
          <Animated.View
            pointerEvents="none"
            style={[glassStyles.active, styles.activeLayer, activeStyle]}
          />
          <View style={{ width: iconSize, height: iconSize }}>
            <Animated.View style={[styles.iconLayer, idleIconStyle]}>
              <FooterGlyph
                iconName={iconName}
                iconSize={iconSize}
                color={TEXT.primary}
              />
            </Animated.View>
            <Animated.View style={[styles.iconLayer, activeStyle]}>
              <FooterGlyph
                iconName={iconName}
                iconSize={iconSize}
                color={TONE.accent}
              />
            </Animated.View>
          </View>
          <Animated.Text
            style={[styles.title, isSmall && styles.titleSmall, labelStyle]}
          >
            {label}
          </Animated.Text>
        </View>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
    alignSelf: 'stretch',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  pressed: {
    backgroundColor: GLASS.pressed,
    borderColor: GLASS.border,
  },
  activeLayer: {
    ...StyleSheet.absoluteFillObject,
    margin: -1,
    borderRadius: 999,
  },
  iconLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  title: {
    fontFamily: DM_SANS.BOLD,
    textAlign: 'center',
    fontSize: 11,
  },
  titleSmall: {
    fontSize: 10,
  },
})
