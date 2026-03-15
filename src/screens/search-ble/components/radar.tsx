import { View, StyleSheet, Dimensions } from 'react-native'
import Animated from 'react-native-reanimated'
import Svg, { Circle, Line } from 'react-native-svg'
import { useSearchBleContext } from '@/contexts'
import { size } from '@search-ble/constants'
import { useSearchBleRaderViewModel } from '@/view-model'
import { Sweeper } from './sweeper'
import { BLUE_PRIMARY, DARK } from '@/theme/color'

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
              y1={1}
              x2={CENTER}
              y2={SIZE}
              stroke={DARK}
              strokeWidth="1"
            />
            <Line
              x1={1}
              y1={CENTER}
              x2={SIZE}
              y2={CENTER}
              stroke={DARK}
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
              r={RADIUS_OUTER + 3}
              stroke={DARK}
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
              stroke={DARK}
              strokeWidth="1"
              fill="none"
            />
          </Svg>
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
                stroke={BLUE_PRIMARY}
                strokeWidth="1.5"
                fill="none"
              />
            </Svg>
          </Animated.View>
        )}
        <View style={[styles.absoluteContainer, styles.sweeper]}>
          <Sweeper size={SIZE} />
        </View>
        <View style={[styles.absoluteContainer, styles.dotContainer]}>
          <Animated.View style={[styles.dot, animated.dotStyle]} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    top: 0,
    marginTop: 80,
  },
  rader: {
    width: SIZE,
    marginHorizontal: 'auto',
  },
  dotContainer: {
    width: SIZE,
    height: SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: size.DOT,
    height: size.DOT,
    borderRadius: '50%',
    backgroundColor: BLUE_PRIMARY,
    boxShadow: `0px 0px 10px 1px ${BLUE_PRIMARY}`,
  },
  sweeper: {
    width: SIZE,
    height: SIZE,
    borderRadius: '50%',
    overflow: 'hidden',
  },
  absoluteContainer: {
    position: 'absolute',
    top: 0,
  },
})
