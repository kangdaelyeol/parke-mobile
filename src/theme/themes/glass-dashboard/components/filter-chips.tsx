import { Pressable, StyleSheet, View } from 'react-native'
import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { GLASS, glassStyles, TEXT } from '../tokens'
import { PRETENDARD } from '@/theme/fonts'
import { SegmentOption } from './segmented-control'
import { useSelectionProgress } from './selection'

interface FilterChipsProps<T extends string> {
  options: readonly SegmentOption<T>[]
  value: T
  onChange: (key: T) => void
}

interface ChipProps {
  label: string
  selected: boolean
  onPress: () => void
}

// 알약 하나: 고르면 밝은 유리가 150ms 동안 덮인다
const Chip = ({ label, selected, onPress }: ChipProps) => {
  const progress = useSelectionProgress(selected)
  const layerStyle = useAnimatedStyle(() => ({ opacity: progress.value }))
  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1],
      [TEXT.tertiary, TEXT.primary],
    ),
  }))
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View style={[styles.chip, pressed && !selected && styles.pressed]}>
          <Animated.View
            pointerEvents="none"
            style={[glassStyles.active, styles.layer, layerStyle]}
          />
          <Animated.Text style={[styles.label, labelStyle]}>
            {label}
          </Animated.Text>
        </View>
      )}
    </Pressable>
  )
}

// 필터 알약 묶음 (영상의 All · Success · Pending · Failed).
// 세그먼트와 달리 칸마다 따로 떨어진 알약이고, 고른 것만 밝은 유리가 된다
export const FilterChips = <T extends string>({
  options,
  value,
  onChange,
}: FilterChipsProps<T>) => (
  <View style={styles.row}>
    {options.map(option => (
      <Chip
        key={option.key}
        label={option.label}
        selected={option.key === value}
        onPress={() => onChange(option.key)}
      />
    ))}
  </View>
)

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    height: 30,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: GLASS.border,
    justifyContent: 'center',
  },
  layer: {
    ...StyleSheet.absoluteFillObject,
    margin: -1,
    borderRadius: 999,
  },
  pressed: {
    backgroundColor: GLASS.pressed,
  },
  label: {
    fontFamily: PRETENDARD.BOLD,
    fontSize: 12,
  },
})
