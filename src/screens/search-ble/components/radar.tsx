import { View, StyleSheet, Dimensions } from 'react-native'
import Animated from 'react-native-reanimated'
import Svg, { Circle, Line } from 'react-native-svg'
import { useSearchBleContext } from '@/contexts'
import { size } from '@search-ble/constants'
import { useSearchBleRaderViewModel } from '@/view-model'

const { width } = Dimensions.get('window')
const SIZE = width * size.WIDTH_RATIO
const CENTER = SIZE / 2
const RADIUS_OUTER = CENTER - 4
const RADIUS_INNER = CENTER / 2

export const Radar = () => {
  const {
    state: { detected },
  } = useSearchBleContext()

  const { animated } = useSearchBleRaderViewModel()

  return (
    <View style={styles.container}>
      <View style={styles.rader}>
        <Animated.View style={[animated.lineStyle, styles.absoluteContainer]}>
          <Svg width={SIZE} height={SIZE}>
            <Line
              x1={CENTER}
              y1={5}
              x2={CENTER}
              y2={SIZE - 5}
              stroke="#555"
              strokeWidth="1"
            />
            <Line
              x1={5}
              y1={CENTER}
              x2={SIZE - 5}
              y2={CENTER}
              stroke="#555"
              strokeWidth="1"
            />
          </Svg>
        </Animated.View>
        <Animated.View
          style={[animated.circleBigStyle, styles.absoluteContainer]}
        >
          <Svg width={SIZE} height={SIZE}>
            <Circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS_OUTER}
              stroke="#bbb"
              strokeWidth="2"
              fill="none"
            />
          </Svg>
        </Animated.View>
        <Animated.View
          style={[animated.circleSmallStyle, styles.absoluteContainer]}
        >
          <Svg width={SIZE} height={SIZE}>
            <Circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS_INNER}
              stroke="#555"
              strokeWidth="1"
              fill="none"
            />
          </Svg>
        </Animated.View>
        <Animated.View style={[animated.dotStyle, styles.absoluteContainer]}>
          <Animated.View
            style={[
              styles.dotContainer,
              animated.dotSpinStyle,
              styles.absoluteContainer,
            ]}
          >
            <View style={styles.dot} />
          </Animated.View>
        </Animated.View>
        {detected && (
          <Animated.View
            style={[animated.detectedCircleStyle, styles.absoluteContainer]}
          >
            <Svg width={SIZE} height={SIZE}>
              <Circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS_INNER}
                stroke="#5ba6ae"
                strokeWidth="1.5"
                fill="none"
              />
            </Svg>
          </Animated.View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    top: 0,
    marginTop: 100,
  },
  rader: {
    width: SIZE,
    marginHorizontal: 'auto',
  },
  dotContainer: {
    width: SIZE,
    height: SIZE,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  dot: {
    width: size.DOT,
    height: size.DOT,
    borderRadius: size.DOT / 2,
    backgroundColor: '#fff',
    shadowColor: '#fff',
    shadowOpacity: 0.8,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  absoluteContainer: {
    position: 'absolute',
    top: 0,
  },
})
