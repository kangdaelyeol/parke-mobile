import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import { GestureDetector } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'
import { CARD_HEIGHT, CARD_WIDTH, SLIDER_GAP } from '@home/constants'
import {
  EmptyCard,
  SettingCard,
  Card,
  EmptyView,
  PaginationDots,
  TodaySummary,
} from '@home/components'
import { useMainViewModel } from '@home/view-model'
import { DM_SANS } from '@/theme/fonts'
import { GRAY } from '@/theme/color'

export const Main = () => {
  const { state, actions, animated } = useMainViewModel()
  const { width } = useWindowDimensions()
  const isSmall = width < 400

  return (
    <View style={styles.container}>
      <View style={[styles.wrapper, isSmall && styles.wrapperSmall]}>
        {state.cardLength === 0 ? (
          <EmptyView />
        ) : (
          <>
            {!state.isSetting && <TodaySummary />}
            <GestureDetector gesture={actions.panGesture}>
              <Animated.View
                style={[styles.cardContainer, animated.sliderStyle]}
              >
                <Animated.View style={animated.cardTitleStyle}>
                  <View style={[styles.title, isSmall && styles.titleSmall]}>
                    <Text
                      style={[
                        styles.titleText,
                        isSmall && styles.titleTextSmall,
                      ]}
                    >
                      내 기기
                    </Text>
                  </View>
                </Animated.View>
                <View style={styles.cardSlider}>
                  <Animated.View
                    style={[animated.moverStyle, styles.cardSliderMover]}
                  >
                    {state.cards &&
                      state.cards.map((card, idx) => (
                        <Card key={idx} card={card} idx={idx} />
                      ))}
                    <EmptyCard idx={state.cardLength} />
                  </Animated.View>
                </View>
                {!state.isSetting && <PaginationDots />}
              </Animated.View>
            </GestureDetector>
          </>
        )}
      </View>
      {state.isSetting && (
        <SettingCard card={state.cards[state.selectedCardIdx]} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
  wrapper: {
    width: '100%',
    maxWidth: 400,
    marginHorizontal: 'auto',
    paddingBottom: 200,
    flex: 1,
  },
  wrapperSmall: {
    maxWidth: 330,
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
    top: -40,
    left: -10,
  },
  titleSmall: {
    top: -25,
    left: -5,
  },
  titleText: {
    color: GRAY,
    fontSize: 15,
    fontFamily: DM_SANS.BOLD,
  },
  titleTextSmall: {
    fontSize: 13,
  },
})
