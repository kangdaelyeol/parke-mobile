import { useEffect } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { delay, duration, repeat } from '@search-ble/constants';
import { UseSearchBLERaderViewModel } from '@search-ble/types';

export const useSearchBLERaderViewModel = (): UseSearchBLERaderViewModel => {
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
      withTiming(1, { duration: repeat.DOT_SPIN, easing: Easing.linear }),
      -1,
      false,
    );

    detectedCircleOpacity.value = withRepeat(
      withTiming(0, {
        duration: repeat.DETECTED_CIRCLE,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
    detectedCircleScale.value = withRepeat(
      withTiming(2.5, {
        duration: repeat.DETECTED_CIRCLE,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
      }),
      -1,
      false,
    );

    circleBigOpacity.value = withDelay(
      delay.RADER,
      withTiming(1, { duration: duration.CIRCLE_OPACITY }),
    );
    circleSmallOpacity.value = withDelay(
      delay.RADER + 300,
      withTiming(1, { duration: duration.CIRCLE_OPACITY }),
    );
    lineOpacity.value = withDelay(
      delay.RADER + 700,
      withTiming(1, { duration: duration.LINE_OPACITY }),
    );
    lineScale.value = withDelay(
      delay.RADER + 700,
      withTiming(1, {
        duration: duration.LINE_SCALE,
        easing: Easing.linear,
      }),
    );
    dotOpacity.value = withDelay(
      delay.RADER + 1500,
      withTiming(1, { duration: duration.DOT_OPACITY }),
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

  const state = {
    dotSpinAnimatedStyle: useAnimatedStyle(() => {
      const rotate = `${spinProgress.value * 360}deg`;
      return {
        transform: [{ rotate }],
      };
    }),

    lineAnimatedStyle: useAnimatedStyle(() => {
      return {
        opacity: lineOpacity.value,
        position: 'absolute',
        top: 0,
        transform: [{ scale: lineScale.value }],
      };
    }),

    circleBigAnimatedStyle: useAnimatedStyle(() => {
      return {
        opacity: circleBigOpacity.value,
        position: 'absolute',
        top: 0,
        transform: [],
      };
    }),

    circleSmallAnimatedStyle: useAnimatedStyle(() => {
      return {
        opacity: circleSmallOpacity.value,
        position: 'absolute',
        top: 0,
        transform: [],
      };
    }),

    dotAnimatedStyle: useAnimatedStyle(() => {
      return {
        opacity: dotOpacity.value,
        position: 'absolute',
        top: 0,
      };
    }),

    detectedCircleAnimatedStyle: useAnimatedStyle(() => {
      return {
        position: 'absolute',
        top: 0,
        transform: [{ scale: detectedCircleScale.value }],
        opacity: detectedCircleOpacity.value,
      };
    }),
  };
  return {
    state,
    actions: {},
  };
};
