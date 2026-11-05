import { StyleSheet, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { GestureDetector } from 'react-native-gesture-handler'
import { useSliderViewModel } from '@on-boarding/view-model'
import { MainArticle1 } from './main-article-1'
import { MainArticle2 } from './main-article-2'
import { MainArticle3 } from './main-article-3'

export const Slider = () => {
  const { animated, actions } = useSliderViewModel()

  return (
    <View style={sliderStyle.container}>
      <GestureDetector gesture={actions.panGesture}>
        <Animated.View
          style={[sliderStyle.animationContainer, animated.sliderStyle]}
        >
          <MainArticle1 />
          <MainArticle2 />
          <MainArticle3 />
        </Animated.View>
      </GestureDetector>
    </View>
  )
}

const sliderStyle = StyleSheet.create({
  animationContainer: {
    flexDirection: 'row',
  },
  container: {
    flex: 1,
  },
})
