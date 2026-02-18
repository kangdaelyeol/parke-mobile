import { useEffect, useState } from 'react';
import { Dimensions, LayoutChangeEvent } from 'react-native';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { SearchBLETitleViewModel } from '@search-ble/types';

export const useSearchBLETitleViewModel = (): SearchBLETitleViewModel => {
  const [titleHeight, setTitleHeight] = useState(0);
  const titleTransY = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const subTitleOpacity = useSharedValue(0);

  useEffect(() => {
    if (!titleHeight) return;

    const deviceHeight = Dimensions.get('window').height;
    titleTransY.value = deviceHeight / 2 - titleHeight * 3.5;
    titleTransY.value = withDelay(
      1500,
      withTiming(0, {
        duration: 1000,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
      }),
    );
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
    subTitleOpacity.value = withDelay(2300, withTiming(1, { duration: 500 }));
  }, [titleHeight, titleOpacity, titleTransY, subTitleOpacity]);

  const state = {
    titleAnimatedStyle: useAnimatedStyle(() => {
      return {
        marginTop: 40,
        opacity: titleOpacity.value,
        transform: [
          {
            translateY: withTiming(titleTransY.value, {
              duration: 300,
              easing: Easing.bezier(0.33, 1, 0.68, 1),
            }),
          },
        ],
      };
    }),

    subTitleAnimatedStyle: useAnimatedStyle(() => {
      return {
        opacity: subTitleOpacity.value,
      };
    }),
  };
  const titleLayout = (e: LayoutChangeEvent) => {
    setTitleHeight(e.nativeEvent.layout.height);
  };

  return {
    state,
    actions: {
      titleLayout,
    },
  };
};
