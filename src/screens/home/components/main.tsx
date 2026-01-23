import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import {
  useUserContext,
  useCardSliderContext,
  useCardSettingContext,
} from '@/contexts';
import { CARD_HEIGHT, CARD_WIDTH, SLIDER_GAP } from '@/screens/home/constants';
import { Card } from './card';
import EmptyCard from './empty-card';
import SettingCard from './setting-card';
import CardOption from './card-option';

export default function Main() {
  const { panGesture, animatedStyle, selectedCard } = useCardSliderContext();
  const { sliderAnimatedStyle, settingCard } = useCardSettingContext();
  const { cards } = useUserContext();
  const CARD_LEN = cards && cards.length;

  const isSettingActivated = settingCard !== -1;

  return (
    <View style={styles.main}>
      <View style={styles.mainWrapper}>
        {!isSettingActivated && cards[selectedCard] && (
          <View style={styles.title}>
            <Text style={styles.titleText}>My parke list</Text>
          </View>
        )}
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.cardContainer, sliderAnimatedStyle]}>
            <View style={styles.cardSlider}>
              <Animated.View style={[animatedStyle, styles.cardSliderMover]}>
                {cards &&
                  cards.map((card, idx) => (
                    <Card key={idx} {...card} idx={idx} />
                  ))}
                <EmptyCard idx={CARD_LEN} />
              </Animated.View>
            </View>
          </Animated.View>
        </GestureDetector>
        {!isSettingActivated && cards[selectedCard] && (
          <CardOption card={cards[selectedCard]} />
        )}
        {isSettingActivated && <SettingCard card={cards[selectedCard]} />}
      </View>
    </View>
  );
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
    color: '#ffffffd8',
    fontSize: 40,
    fontWeight: 'bold',
  },
});
