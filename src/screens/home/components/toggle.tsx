import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { GREEN } from '@/theme/color'

interface ToggleProps {
  scan: boolean
}

export const Toggle = ({ scan }: ToggleProps) => {
  const dotLeft = useSharedValue(0)

  useEffect(() => {
    if (scan === true)
      dotLeft.value = withTiming(1, {
        duration: 300,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
      })
    else
      dotLeft.value = withTiming(0, {
        duration: 300,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
      })
  }, [scan, dotLeft])

  const dotStyle = useAnimatedStyle(() => ({
    left: dotLeft.value * 31 + 2,
  }))

  return (
    <View
      style={[
        styles.container,
        scan ? styles.backgroundOn : styles.backgroundOff,
      ]}
    >
      <Animated.View style={[styles.dot, dotStyle]} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 30,
    borderRadius: 100,
  },
  backgroundOn: {
    backgroundColor: GREEN,
  },
  backgroundOff: {
    backgroundColor: '#f76262',
  },
  dot: {
    width: 25,
    height: 25,
    borderRadius: '50%',
    backgroundColor: 'black',
    marginVertical: 'auto',
    left: 2, // 2 - 33
  },
})
