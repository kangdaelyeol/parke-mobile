import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Card } from './card';
import EmptyCard from './empty-card';
import { CARD_HEIGHT, CARD_WIDTH, SLIDER_GAP } from '../constants';


const tempData = [
  {
    title: 'my parke 1',
    phone: '010-2413-0510',
  },
  {
    title: 'my parke 2',
    phone: '010-1234-5678',
  },
  {
    title: 'my parke 3',
    phone: '010-9876-5432',
  },
];

const CARD_LEN = tempData.length;

export default function Main() {
  const prevSliderTranslatedX = useSharedValue(0);

  const sliderTranslatedX = useSharedValue(0);

  const selectedCardIdx = useSharedValue(0);

  const eventCnt = useSharedValue(1);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      sliderTranslatedX.value = prevSliderTranslatedX.value;
    })
    .onUpdate(e => {
      const translatedX = prevSliderTranslatedX.value + e.translationX;
      sliderTranslatedX.value = translatedX;

      eventCnt.value += 1;
    })
    .onEnd(e => {
      const transXPerEvent = e.translationX / eventCnt.value;

      if (transXPerEvent > 10) {
        selectedCardIdx.value = Math.max(0, selectedCardIdx.value - 1);
        prevSliderTranslatedX.value = sliderTranslatedX.value =
          -selectedCardIdx.value * (CARD_WIDTH + SLIDER_GAP);
        eventCnt.value = 1;
        return;
      } else if (transXPerEvent < -10) {
        selectedCardIdx.value = Math.min(CARD_LEN, selectedCardIdx.value + 1);
        prevSliderTranslatedX.value = sliderTranslatedX.value =
          -selectedCardIdx.value * (CARD_WIDTH + SLIDER_GAP);
        eventCnt.value = 1;
        return;
      }

      if (sliderTranslatedX.value > 0) {
        prevSliderTranslatedX.value = sliderTranslatedX.value = 0;
        selectedCardIdx.value = 0;
      } else {
        selectedCardIdx.value = Math.max(
          0,
          Math.min(
            CARD_LEN,
            Math.round(-sliderTranslatedX.value / (CARD_WIDTH + SLIDER_GAP)),
          ),
        );

        const translateX = -selectedCardIdx.value * (CARD_WIDTH + SLIDER_GAP);

        prevSliderTranslatedX.value = sliderTranslatedX.value = translateX;
      }

      eventCnt.value = 1;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(sliderTranslatedX.value, {
          duration: 300,
          easing: Easing.out(Easing.cubic),
        }),
      },
    ],
  }));

  return (
    
      <View style={styles.main}>
        <View style={styles.mainWrapper}>
          <GestureDetector gesture={panGesture}>
            <View style={styles.cardContainer}>
              <View style={styles.cardSlider}>
                <Animated.View style={[animatedStyle, styles.cardSliderMover]}>
                  {tempData.map((card, idx) => (
                    <Card
                      key={idx}
                      {...card}
                      idx={idx}
                      selected={selectedCardIdx}
                    />
                  ))}
                  <EmptyCard idx={CARD_LEN} selected={selectedCardIdx} />
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
