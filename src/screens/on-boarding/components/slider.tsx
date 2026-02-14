import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import { useOnBoardingSliderViewModel } from '@/view-model';
import {
  MainArticle1,
  MainArticle2,
  MainArticle3,
} from '@on-boarding/components';

export const Slider = () => {
  const { state, actions } = useOnBoardingSliderViewModel();

  return (
    <View style={sliderStyle.container}>
      <GestureDetector gesture={actions.panGesture}>
        <Animated.View
          style={[sliderStyle.animationContainer, state.animatedStyle]}
        >
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
