import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import { GestureDetector } from 'react-native-gesture-handler'
import Animated, { FadeIn } from 'react-native-reanimated'
import { CARD_HEIGHT, CARD_WIDTH, SLIDER_GAP } from '@home/constants'
import {
  EmptyCard,
  SettingCard,
  Card,
  CardSkeleton,
  EmptyView,
  PaginationDots,
  TodaySummary,
} from '@home/components'
import { useMainViewModel } from '@home/view-model'
import { HomeMainProps } from '@home/types'
import { DM_SANS } from '@/theme/fonts'
import { GRAY } from '@/theme/color'

export const Main = ({ loading }: HomeMainProps) => {
  const { state, actions, animated } = useMainViewModel()
  // 카드를 아직 한 번도 못 불러온 상태에서만 뼈대를 보여준다.
  // 이미 카드가 있으면 다시 동기화하는 동안에도 기존 카드를 그대로 둔다.
  const showSkeleton = loading && state.cardLength === 0
  const { width } = useWindowDimensions()
  const isSmall = width < 400

  return (
    <View style={styles.container}>
      <View style={[styles.wrapper, isSmall && styles.wrapperSmall]}>
        {state.cardLength === 0 && !showSkeleton ? (
          <EmptyView />
        ) : (
          <>
            <Animated.View
              pointerEvents={state.isSetting ? 'none' : 'auto'}
              style={[StyleSheet.absoluteFill, animated.homeContentStyle]}
            >
              <TodaySummary />
            </Animated.View>
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
                    {showSkeleton ? (
                      <CardSkeleton />
                    ) : (
                      <>
                        {state.cards.map((card, idx) => (
                          <Animated.View
                            key={card.id}
                            entering={FadeIn.duration(350)}
                          >
                            <Card card={card} idx={idx} />
                          </Animated.View>
                        ))}
                        <EmptyCard idx={state.cardLength} />
                      </>
                    )}
                  </Animated.View>
                </View>
                {!showSkeleton && (
                  <Animated.View
                    pointerEvents={state.isSetting ? 'none' : 'auto'}
                    style={animated.homeContentStyle}
                  >
                    <PaginationDots />
                  </Animated.View>
                )}
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
