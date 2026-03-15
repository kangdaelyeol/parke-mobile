import { useEffect } from 'react'
import { View } from 'react-native'
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  withDelay,
} from 'react-native-reanimated'

const AnimatedView = Animated.createAnimatedComponent(View)

export const Sweeper = ({ size = 300 }) => {
  const rotation = useSharedValue(0)
  const opacity = useSharedValue(0)

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1,
    )
    opacity.value = withDelay(
      2000,
      withTiming(1, {
        duration: 1000,
        easing: Easing.linear,
      }),
    )
  }, [rotation, opacity])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
    opacity: opacity.value,
  }))

  const r = size / 2

  return (
    <AnimatedView style={[{ width: size, height: size }, animatedStyle]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <LinearGradient id="sweep" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#3B3BF9" stopOpacity="0.05" />
            <Stop offset="0.7" stopColor="#3B3BF9" stopOpacity="0.15" />
            <Stop offset="1" stopColor="#3B3BF9" stopOpacity="0.22" />
          </LinearGradient>
        </Defs>
        <Path
          d={`M ${r} ${r} L ${r} 0 A ${r} ${r} 0 0 1 ${
            r + r * Math.sin(Math.PI / 6)
          } ${r - r * Math.cos(Math.PI / 6)} Z`}
          fill="url(#sweep)"
        />
      </Svg>
    </AnimatedView>
  )
}
