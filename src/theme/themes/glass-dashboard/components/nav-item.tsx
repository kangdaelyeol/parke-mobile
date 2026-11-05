import { memo } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import { GLASS, glassStyles, TEXT, Tone, TONE } from '../tokens'
import { PRETENDARD } from '@/theme/fonts'
import { PRESS_MS, useSelectionProgress } from './selection'
import { StatusPill } from './status-pill'
import { SolidIconName } from './types'

interface NavItemProps {
  icon: SolidIconName
  label: string
  // 고른 메뉴: 밝은 유리 알약 + 강조색 아이콘 (영상의 Overview)
  active?: boolean
  // 오른쪽 작은 알약 (영상의 Analytics 옆 Live)
  badge?: { label: string; tone?: Tone }
  onPress?: () => void
}

const SHIFT_X = 4

// 메뉴 한 줄 (영상 사이드바).
// - 누르는 동안: 옅은 알약이 깔리며 오른쪽으로 4px 밀린다 (영상의 마우스를 올렸을 때)
// - 고르면: 밝은 유리 알약과 강조색 아이콘이 150ms 동안 교차해 나타난다
export const NavItem = memo(
  ({ icon, label, active = false, badge, onPress }: NavItemProps) => {
    const selected = useSelectionProgress(active)
    const press = useSharedValue(0)

    const shiftStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: press.value * SHIFT_X * (1 - selected.value) }],
    }))
    const pressLayerStyle = useAnimatedStyle(() => ({
      opacity: press.value * (1 - selected.value),
    }))
    const activeLayerStyle = useAnimatedStyle(() => ({
      opacity: selected.value,
    }))
    const idleIconStyle = useAnimatedStyle(() => ({
      opacity: 1 - selected.value,
    }))
    const labelStyle = useAnimatedStyle(() => ({
      color: interpolateColor(
        selected.value,
        [0, 1],
        [TEXT.secondary, TEXT.primary],
      ),
    }))

    return (
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          press.value = withTiming(1, { duration: PRESS_MS })
        }}
        onPressOut={() => {
          press.value = withTiming(0, { duration: PRESS_MS })
        }}
      >
        <Animated.View style={[styles.item, shiftStyle]}>
          <Animated.View
            pointerEvents="none"
            style={[styles.layer, styles.pressLayer, pressLayerStyle]}
          />
          <Animated.View
            pointerEvents="none"
            style={[glassStyles.active, styles.layer, activeLayerStyle]}
          />
          <View style={styles.icon}>
            <Animated.View style={[styles.iconLayer, idleIconStyle]}>
              <FontAwesome6
                name={icon}
                iconStyle="solid"
                size={14}
                color={TEXT.secondary}
              />
            </Animated.View>
            <Animated.View style={[styles.iconLayer, activeLayerStyle]}>
              <FontAwesome6
                name={icon}
                iconStyle="solid"
                size={14}
                color={TONE.accent}
              />
            </Animated.View>
          </View>
          <Animated.Text
            style={[styles.label, active && styles.labelActive, labelStyle]}
            numberOfLines={1}
          >
            {label}
          </Animated.Text>
          {badge && (
            <StatusPill label={badge.label} tone={badge.tone ?? 'danger'} />
          )}
        </Animated.View>
      </Pressable>
    )
  },
)

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 44,
    paddingHorizontal: 14,
  },
  layer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
  },
  pressLayer: {
    borderWidth: 1,
    borderColor: GLASS.border,
    backgroundColor: GLASS.pressed,
  },
  icon: {
    width: 18,
    height: 18,
  },
  iconLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 14,
  },
  labelActive: {
    fontFamily: PRETENDARD.BOLD,
  },
})
