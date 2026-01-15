import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { Card } from './card';
import EmptyCard from './empty-card';
import { CARD_HEIGHT, CARD_WIDTH, SLIDER_GAP } from '../constants';

import { useUserContext } from '@/contexts/user-context';
import { useCardSliderContext } from '@/contexts/slider-context';

export default function Main() {
  const user = useUserContext();
  const { panGesture, animatedStyle } = useCardSliderContext();
  const { cards } = user;
  const CARD_LEN = cards && cards.length;

  return (
    <View style={styles.main}>
      <View style={styles.mainWrapper}>
        <GestureDetector gesture={panGesture}>
          <View style={styles.cardContainer}>
            <View style={styles.cardSlider}>
              <Animated.View style={[animatedStyle, styles.cardSliderMover]}>
                {cards &&
                  cards.map((card, idx) => (
                    <Card key={idx} {...card} idx={idx} />
                  ))}
                <EmptyCard idx={CARD_LEN} />
              </Animated.View>
            </View>
          </View>
        </GestureDetector>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    width: '100%',
  },
  mainWrapper: {
    width: '100%',
    maxWidth: 480,
    marginHorizontal: 'auto',
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginTop: 30,
    marginHorizontal: 'auto',
  },
  cardSlider: {
    width: CARD_WIDTH,
  },
  cardSliderMover: {
    flexDirection: 'row',
    gap: SLIDER_GAP,
  },
});
