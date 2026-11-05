import { memo } from 'react'
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { glassStyles, glassText, TEXT, Tone } from '../tokens'
import { PRETENDARD } from '@/theme/fonts'
import { IconTile } from './icon-tile'
import { StatusPill } from './status-pill'
import { LIFT_SPRING, LIFT_Y } from './selection'
import { SolidIconName } from './types'

interface StatCardProps {
  title: string
  value: string
  // 값 뒤 단위 (회, km 등)
  unit?: string
  icon?: SolidIconName
  tone?: Tone
  // 값 아래 알약 (영상의 ↗ +14.6%)
  badge?: { label: string; tone?: Tone; icon?: SolidIconName }
  // 알약 옆 설명 (영상의 vs last month)
  caption?: string
  // 있으면 누를 수 있고, 누르는 동안 위로 떠오른다 (영상 코드의 whileHover y:-5)
  onPress?: () => void
  // 판 없이 내용만 그린다 (다른 유리 판 안에 여러 개를 묶어 넣을 때)
  bare?: boolean
  style?: StyleProp<ViewStyle>
}

// 통계 카드 (영상의 StatsCard): 이름 + 아이콘 타일 / 큰 값 / 알약 + 설명
export const StatCard = memo(
  ({
    title,
    value,
    unit,
    icon,
    tone,
    badge,
    caption,
    onPress,
    bare,
    style,
  }: StatCardProps) => {
    const lift = useSharedValue(0)
    const liftStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: lift.value }],
    }))

    return (
      <Animated.View
        style={[
          bare ? styles.bare : [glassStyles.surface, styles.card],
          style,
          liftStyle,
        ]}
      >
        <View style={styles.top}>
          <Text style={[glassText.label, styles.title]} numberOfLines={1}>
            {title}
          </Text>
          {icon && <IconTile icon={icon} tone={tone} size={28} />}
        </View>
        <View style={styles.valueRow}>
          {/* 긴 값(1시간 23분 등)은 칸에 맞춰 글자를 줄인다 */}
          <Text
            style={[glassText.value, styles.value]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >
            {value}
          </Text>
          {!!unit && <Text style={styles.unit}>{unit}</Text>}
        </View>
        {(badge || caption) && (
          <View style={styles.bottom}>
            {badge && <StatusPill {...badge} />}
            {!!caption && (
              <Text
                style={[glassText.caption, styles.caption]}
                numberOfLines={1}
              >
                {caption}
              </Text>
            )}
          </View>
        )}
        {onPress && (
          // 글자 위를 눌러도 받도록 맨 위에 투명한 덮개를 둔다
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={onPress}
            onPressIn={() => {
              lift.value = withSpring(LIFT_Y, LIFT_SPRING)
            }}
            onPressOut={() => {
              lift.value = withSpring(0, LIFT_SPRING)
            }}
          />
        )}
      </Animated.View>
    )
  },
)

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 14,
    gap: 8,
  },
  bare: {
    gap: 8,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    flex: 1,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  value: {
    flexShrink: 1,
  },
  unit: {
    color: TEXT.tertiary,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 13,
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  caption: {
    flexShrink: 1,
  },
})
