import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import {
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { useSlider } from '@/controllers/use-slider';
import { MainArticle1, MainArticle2, MainArticle3 } from '.';

const Slider = () => {
  const { panGesture, animatedStyle } = useSlider();

  return (
    <View style={sliderStyle.container}>
      <GestureHandlerRootView>
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[sliderStyle.animationContainer, animatedStyle]}
          >
            <MainArticle1 />
            <MainArticle2 />
            <MainArticle3 />
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
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

export default Slider;
