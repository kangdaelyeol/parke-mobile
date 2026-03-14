import { useEffect } from 'react'
import { StyleSheet, View, Pressable } from 'react-native'
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

interface ToggleProps {
  value: boolean
  disabled?: boolean
  onValueChange: (val: boolean) => void
}

export const Toggle = ({ value, disabled, onValueChange }: ToggleProps) => {
  const toggleProgress = useSharedValue(0)

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: 28 - toggleProgress.value * 28 }],
  }))

  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      toggleProgress.value,
      [0, 1],
      ['#3b3bf9', '#2a2a2a'],
    ),
  }))

  const handleTogglePress = () => {
    if (disabled) return
    onValueChange(!value)
  }

  useEffect(() => {
    if (value === true) {
      toggleProgress.value = withTiming(0, {
        duration: 550,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
      })
    } else {
      toggleProgress.value = withTiming(1, {
        duration: 550,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
      })
    }
  }, [value, toggleProgress])

  return (
    <Pressable onPress={handleTogglePress}>
      <Animated.View style={[styles.container, backgroundStyle]}>
        {disabled && <View style={[disabled && styles.disabledContainer]} />}
        <Animated.View style={[styles.dot, dotStyle]} />
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 58,
    height: 30,
    borderRadius: 3333,
    backgroundColor: '#3b3bf9',
    justifyContent: 'center',
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    backgroundColor: '#e5e5e5',
    left: 3,
    transform: [{ translateX: 27 }],
  },
  disabledContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 3333,
    zIndex: 1,
    backgroundColor: '#000000af',
  },
})
