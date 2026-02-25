import { View, StyleSheet, Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Circle, Line } from 'react-native-svg';
import { useSearchBleContext } from '@/contexts';
import { size } from '@search-ble/constants';
import { useSearchBLERaderViewModel } from '@/view-model';

const { width } = Dimensions.get('window');
const SIZE = width * size.WIDTH_RATIO;
const CENTER = SIZE / 2;
const RADIUS_OUTER = CENTER - 4;
const RADIUS_INNER = CENTER / 2;

export const Radar = () => {
  const {
    state: { detected },
  } = useSearchBleContext();

  const { state } = useSearchBLERaderViewModel();

  return (
    <View style={styles.container}>
      <View style={styles.rader}>
        <Animated.View style={state.lineAnimatedStyle}>
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
        <Animated.View style={state.circleBigAnimatedStyle}>
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
        <Animated.View style={state.circleSmallAnimatedStyle}>
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
        <Animated.View style={state.dotAnimatedStyle}>
          <Animated.View
            style={[styles.dotContainer, state.dotSpinAnimatedStyle]}
          >
            <View style={styles.dot} />
          </Animated.View>
        </Animated.View>
        {detected && (
          <Animated.View style={state.detectedCircleAnimatedStyle}>
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
  );
};

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
});
