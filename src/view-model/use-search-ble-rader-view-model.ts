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
import { SearchBleRaderViewModel } from '@search-ble/types';

export const useSearchBleRaderViewModel = (): SearchBleRaderViewModel => {
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

  const animated = {
    dotSpinStyle: useAnimatedStyle(() => {
      const rotate = `${spinProgress.value * 360}deg`;
      return {
        transform: [{ rotate }],
      };
    }),

    lineStyle: useAnimatedStyle(() => {
      return {
        opacity: lineOpacity.value,

        transform: [{ scale: lineScale.value }],
      };
    }),

    circleBigStyle: useAnimatedStyle(() => {
      return {
        opacity: circleBigOpacity.value,
      };
    }),

    circleSmallStyle: useAnimatedStyle(() => {
      return {
        opacity: circleSmallOpacity.value,
      };
    }),

    dotStyle: useAnimatedStyle(() => {
      return {
        opacity: dotOpacity.value,
      };
    }),

    detectedCircleStyle: useAnimatedStyle(() => {
      return {
        transform: [{ scale: detectedCircleScale.value }],
        opacity: detectedCircleOpacity.value,
      };
    }),
  };
  return {
    state: {},
    animated,
    actions: {},
  };
};
