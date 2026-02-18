import { useSearchBLEContext } from '@/contexts/search-ble-context';
import { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle, Line } from 'react-native-svg';

const { width } = Dimensions.get('window');
const SIZE = width * 0.7;
const CENTER = SIZE / 2;
const RADIUS_OUTER = CENTER - 4;
const RADIUS_INNER = CENTER / 2;
const DOT_SIZE = 10;

const DELAY = 1300;

export const Radar = () => {
  const {
    state: { detected },
  } = useSearchBLEContext();
  const lineOpacity = useSharedValue(0);
  const lineScale = useSharedValue(0);
  const circleSmallOpacity = useSharedValue(0);
  const circleBigOpacity = useSharedValue(0);
  const dotOpacity = useSharedValue(0);
  const spinProgress = useSharedValue(0);
  const detectedCircleOpacity = useSharedValue(1);
  const detectedCircleScale = useSharedValue(0);

  useEffect(() => {
    spinProgress.value = withRepeat(
      withTiming(1, { duration: 2300, easing: Easing.linear }),
      -1,
      false,
    );

    detectedCircleOpacity.value = withRepeat(
      withTiming(0, { duration: 1500, easing: Easing.linear }),
      -1,
      false,
    );
    detectedCircleScale.value = withRepeat(
      withTiming(2.5, {
        duration: 1500,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
      }),
      -1,
      false,
    );

    circleBigOpacity.value = withDelay(
      DELAY + 500,
      withTiming(1, { duration: 500 }),
    );
    circleSmallOpacity.value = withDelay(
      DELAY + 800,
      withTiming(1, { duration: 500 }),
    );
    lineOpacity.value = withDelay(
      DELAY + 1200,
      withTiming(1, { duration: 500 }),
    );
    lineScale.value = withDelay(
      DELAY + 1200,
      withTiming(1, {
        duration: 2000,
        easing: Easing.linear,
      }),
    );
    dotOpacity.value = withDelay(
      DELAY + 1500,
      withTiming(1, { duration: 500 }),
    );
  }, [
    circleBigOpacity,
    circleSmallOpacity,
    dotOpacity,
    lineOpacity,
    spinProgress,
    lineScale,
    detectedCircleOpacity,
    detectedCircleScale,
  ]);

  const spinAnimation = useAnimatedStyle(() => {
    const rotate = `${spinProgress.value * 360}deg`;
    return {
      transform: [{ rotate }],
    };
  });

  const lineAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: lineOpacity.value,
      position: 'absolute',
      top: 0,
      transform: [{ scale: lineScale.value }],
    };
  });

  const circleBigAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: circleBigOpacity.value,
      position: 'absolute',
      top: 0,
      transform: [],
    };
  });

  const circleSmallAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: circleSmallOpacity.value,
      position: 'absolute',
      top: 0,
      transform: [],
    };
  });

  const dotAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: dotOpacity.value,
      position: 'absolute',
      top: 0,
    };
  });

  const detectedCircleAnimatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      top: 0,
      transform: [{ scale: detectedCircleScale.value }],
      opacity: detectedCircleOpacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.rader}>
        <Animated.View style={lineAnimatedStyle}>
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
        <Animated.View style={circleBigAnimatedStyle}>
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
        <Animated.View style={circleSmallAnimatedStyle}>
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
        <Animated.View style={dotAnimatedStyle}>
          <Animated.View style={[styles.dotContainer, spinAnimation]}>
            <View style={styles.dot} />
          </Animated.View>
        </Animated.View>
        {detected && (
          <Animated.View style={detectedCircleAnimatedStyle}>
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
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: '#fff',
    shadowColor: '#fff',
    shadowOpacity: 0.8,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
});
