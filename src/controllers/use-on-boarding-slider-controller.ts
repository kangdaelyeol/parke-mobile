import { Dimensions } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import {
  useAnimatedStyle,
  withTiming,
  Easing,
  useSharedValue,
} from 'react-native-reanimated';
import { useOnBoardingContext } from '@/contexts';

export const useOnBoardingSliderController = () => {
  const { sliderTranslateX, setPageIdx } = useOnBoardingContext();
  const DEVICE_WIDTH = Dimensions.get('window').width;

  const prevTranslateX = useSharedValue(0);
  const eventCount = useSharedValue(0);
  const prevPosition = useSharedValue(0);
  const totalMovedX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      prevTranslateX.value = sliderTranslateX.value;
      eventCount.value = 1;
      totalMovedX.value = 0;
    })
    .onUpdate(e => {
      const maxTranslateX = 0;
      const minTranslateX = -2 * DEVICE_WIDTH;
      sliderTranslateX.value = Math.min(
        maxTranslateX,
        Math.max(minTranslateX, prevTranslateX.value + e.translationX),
      );
      totalMovedX.value = e.translationX - prevPosition.value;
      eventCount.value++;
      prevPosition.value = e.translationX;
    })
    .onTouchesUp(() => {
      const nowPage = Math.floor(-sliderTranslateX.value / DEVICE_WIDTH);
      const averageMovedX = totalMovedX.value / eventCount.value;

      if (averageMovedX <= -0.6) {
        const newPageIdx = Math.min(3, nowPage + 2);
        setPageIdx(newPageIdx);
        sliderTranslateX.value = -(newPageIdx - 1) * DEVICE_WIDTH;
      } else if (averageMovedX >= 0.6) {
        const newPageIdx = Math.max(1, nowPage + 1);
        setPageIdx(newPageIdx);
        sliderTranslateX.value = -(newPageIdx - 1) * DEVICE_WIDTH;
      } else {
        const decimalPlaces =
          (-sliderTranslateX.value - nowPage * DEVICE_WIDTH) / DEVICE_WIDTH;

        const newPageIdx = Math.max(
          1,
          Math.min(3, nowPage + Math.round(decimalPlaces) + 1),
        );
        sliderTranslateX.value = -(newPageIdx - 1) * DEVICE_WIDTH;
        setPageIdx(newPageIdx);
      }
    })
    .runOnJS(true);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(sliderTranslateX.value, {
          duration: 300,
          easing: Easing.out(Easing.cubic),
        }),
      },
    ],
  }));

  return { panGesture, animatedStyle };
};
