import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import { useOnBoardingSliderController } from '@/controllers';
import {
  MainArticle1,
  MainArticle2,
  MainArticle3,
} from '@on-boarding/components';

export const Slider = () => {
  const { panGesture, animatedStyle } = useOnBoardingSliderController();

  return (
    <View style={sliderStyle.container}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[sliderStyle.animationContainer, animatedStyle]}>
          <MainArticle1 />
          <MainArticle2 />
          <MainArticle3 />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const sliderStyle = StyleSheet.create({
  animationContainer: {
    flexDirection: 'row',
  },
  container: {
    flex: 1,
  },
});
