import { StyleSheet, Text, View } from 'react-native'
import { GestureDetector } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'
import { CARD_HEIGHT, CARD_WIDTH, SLIDER_GAP } from '@home/constants'
import { EmptyCard, SettingCard, CardOption, Card } from '@home/components'
import { useHomeMainViewModel } from '@/view-model'
import { PRETENDARD } from '@/theme/fonts'

export const Main = () => {
  const { state, actions, animated } = useHomeMainViewModel()

  return (
    <View style={styles.main}>
      <View style={styles.mainWrapper}>
        {!state.isSetting && (
          <>
            <View style={styles.title}>
              <Text style={styles.titleText}>Parke list</Text>
            </View>
          </>
        )}
        <GestureDetector gesture={actions.panGesture}>
          <Animated.View style={[styles.cardContainer, animated.sliderStyle]}>
            <View style={styles.cardSlider}>
              <Animated.View
                style={[animated.moverStyle, styles.cardSliderMover]}
              >
                {state.cards &&
                  state.cards.map((card, idx) => (
                    <Card key={idx} {...card} idx={idx} />
                  ))}
                <EmptyCard idx={state.cardLength} />
              </Animated.View>
            </View>
          </Animated.View>
        </GestureDetector>
        {!state.isSetting && state.cards[state.selectedCardIdx] && (
          <CardOption card={state.cards[state.selectedCardIdx]} />
        )}
        {state.isSetting && (
          <SettingCard card={state.cards[state.selectedCardIdx]} />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    width: '100%',
    flex: 1,
  },
  mainWrapper: {
    width: '100%',
    maxWidth: 480,
    marginHorizontal: 'auto',
    paddingBottom: 200,
    flex: 1,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginHorizontal: 'auto',
  },
  cardSlider: {
    width: CARD_WIDTH,
  },
  cardSliderMover: {
    flexDirection: 'row',
    gap: SLIDER_GAP,
  },
  title: {
    position: 'absolute',
    top: 110,
    width: '100%',
  },
  titleText: {
    marginHorizontal: 'auto',
    color: '#d0d0d0',
    fontSize: 20,
    fontFamily: PRETENDARD.MEDIUM,
  },
  test: {
    position: 'absolute',
    top: 30,
    left: 30,
    fontWeight: 'bold',
    fontSize: 20,
    color: '#1234d9',
  },
  test2: {
    position: 'absolute',
    top: 30,
    left: 120,
    fontWeight: 'bold',
    fontSize: 20,
    color: '#1234d9',
  },
})
