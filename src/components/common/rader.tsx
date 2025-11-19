import { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';

const { width } = Dimensions.get('window');
const SIZE = width * 0.6;
const CENTER = SIZE / 2;
const RADIUS_OUTER = CENTER - 4;
const RADIUS_INNER = CENTER / 2;
const DOT_SIZE = 10;

export default function Radar({ props, style }: { props?: any; style?: any }) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2300,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View {...props} style={{ ...style, ...styles.container }}>
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

        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS_OUTER}
          stroke="#bbb"
          strokeWidth="2"
          fill="none"
        />
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS_INNER}
          stroke="#555"
          strokeWidth="1"
          fill="none"
        />
      </Svg>

      <Animated.View
        style={[styles.dotContainer, { transform: [{ rotate: spin }] }]}
      >
        <View style={styles.dot} />
      </Animated.View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotContainer: {
    position: 'absolute',
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
