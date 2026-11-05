import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { glassStyles, TEXT } from '../tokens'
import { PRETENDARD } from '@/theme/fonts'
import { useSelectionProgress } from './selection'

export interface SegmentOption<T extends string> {
  key: T
  label: string
}

interface SegmentedControlProps<T extends string> {
  options: readonly SegmentOption<T>[]
  value: T
  onChange: (key: T) => void
  style?: StyleProp<ViewStyle>
}

interface SegmentProps {
  label: string
  selected: boolean
  onPress: () => void
}

// 칸 하나: 고르면 밝은 유리 알약이 150ms 동안 나타난다 (영상 메뉴와 같은 전환)
const Segment = ({ label, selected, onPress }: SegmentProps) => {
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
    <Pressable style={styles.segment} onPress={onPress}>
      <Animated.View
        pointerEvents="none"
        style={[glassStyles.active, styles.indicator, layerStyle]}
      />
      <Animated.Text style={[styles.label, labelStyle]} numberOfLines={1}>
        {label}
      </Animated.Text>
    </Pressable>
  )
}

// 세그먼트 (영상의 Today·7D·30D·1Y): 파인 바탕 위에서 고른 칸만 밝은 유리가 된다
export const SegmentedControl = <T extends string>({
  options,
  value,
  onChange,
  style,
}: SegmentedControlProps<T>) => (
  <View style={[glassStyles.inset, styles.track, style]}>
    {options.map(option => (
      <Segment
        key={option.key}
        label={option.label}
        selected={option.key === value}
        onPress={() => onChange(option.key)}
      />
    ))}
  </View>
)

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    height: 38,
    padding: 3,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 9,
  },
  label: {
    fontFamily: PRETENDARD.BOLD,
    fontSize: 13,
  },
})
