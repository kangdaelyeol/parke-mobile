import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { Card } from './card';
import EmptyCard from './empty-card';
import { CARD_HEIGHT, CARD_WIDTH, SLIDER_GAP } from '../constants';

import { useUserContext } from '@/contexts/user-context';
import { useCardSliderContext } from '@/contexts/slider-context';
import { useCardSettingContext } from '@/contexts/card-setting-context';
import SettingCard from './setting-card';
import CardOption from './card-option';

export default function Main() {
  const { panGesture, animatedStyle, selectedCard } =
    useCardSliderContext();
  const { sliderAnimatedStyle, settingCard } = useCardSettingContext();
  const { cards } = useUserContext();
  const CARD_LEN = cards && cards.length;

  return (
    <View style={styles.main}>
      <View style={styles.mainWrapper}>
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
        {cards[selectedCard] && <CardOption card={cards[selectedCard]} />}
        {settingCard !== -1 && <SettingCard />}
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
});
