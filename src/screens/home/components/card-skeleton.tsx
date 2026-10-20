import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import { CARD_HEIGHT, CARD_WIDTH } from '@home/constants'
import { DARK, DARK_LIGHT } from '@/theme/color'

const BOTTOM_HEIGHT = 60

// 카드를 처음 불러오는 동안 카드 자리에 보여주는 뼈대 (실제 카드와 같은 크기·배치)
export const CardSkeleton = () => {
  const pulse = useSharedValue(0)

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    )
  }, [pulse])

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: 0.35 + pulse.value * 0.45,
  }))

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.fill, shimmerStyle]}>
        <View style={[styles.bar, styles.brand]} />
        <View style={[styles.circle, styles.more]} />
        <View style={[styles.bar, styles.title]} />
        <View style={[styles.bar, styles.phone]} />
        <View style={[styles.bar, styles.scan]} />
        <View style={styles.divider} />
        <View style={[styles.pill, styles.pillFirst]} />
        <View style={[styles.pill, styles.pillSecond]} />
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 'auto',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#141414',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: DARK_LIGHT,
    overflow: 'hidden',
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
  },
  bar: {
    position: 'absolute',
    height: 12,
    borderRadius: 6,
    backgroundColor: DARK_LIGHT,
  },
  circle: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: DARK_LIGHT,
  },
  pill: {
    position: 'absolute',
    bottom: (BOTTOM_HEIGHT - 35) / 2,
    height: 35,
    borderRadius: 18,
    backgroundColor: DARK,
    borderWidth: 1,
    borderColor: DARK_LIGHT,
  },
  brand: { top: 17, left: 15, width: 48, height: 10 },
  more: { top: 13, right: 18 },
  title: {
    bottom: BOTTOM_HEIGHT + 38,
    left: 17,
    width: 130,
    height: 20,
    borderRadius: 8,
  },
  phone: { bottom: BOTTOM_HEIGHT + 26, right: 15, width: 110 },
  scan: { bottom: BOTTOM_HEIGHT + 15, left: 18, width: 80, height: 10 },
  divider: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: DARK_LIGHT,
    bottom: BOTTOM_HEIGHT,
  },
  pillFirst: { left: 15, width: 80 },
  pillSecond: { left: 105, width: 80 },
})
