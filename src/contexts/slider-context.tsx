import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';
import {
  clamp,
  Easing,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useCardSettingContext } from '@/contexts/card-setting-context';
import { Gesture, PanGesture } from 'react-native-gesture-handler';
import { CARD_WIDTH, SLIDER_GAP } from '@/screens/home/constants';
import { useUserContext } from './user-context';
import { DefaultStyle } from 'react-native-reanimated/lib/typescript/hook/commonTypes';
import { runOnJS } from 'react-native-worklets';

interface SliderController {
  goToNext: () => void;
  goToPrev: () => void;
  goToIdx: (idx: number) => void;
}

interface SliderContext {
  panGesture: PanGesture;
  animatedStyle: DefaultStyle;
  selectedCardIdx: SharedValue<number>;
  sliderController: SliderController;
  selectedCard: number;
}

const sliderContext = createContext({} as SliderContext);

export default function SliderContextProvider({ children }: PropsWithChildren) {
  const user = useUserContext();
  const { settingCard } = useCardSettingContext();
  const { cards } = user;
  const CARD_LEN = cards && cards.length;

  const prevSliderTranslatedX = useSharedValue(0);

  const sliderTranslatedX = useSharedValue(0);

  const selectedCardIdx = useSharedValue(0);

  const [selectedCard, setSelectedCard] = useState(0);

  const SLIDER_INTERVAL = CARD_WIDTH + SLIDER_GAP;

  const sliderController = {
    goToNext: () => {
      'worklet';
      const idx = Math.min(CARD_LEN, selectedCardIdx.value + 1);
      selectedCardIdx.value = idx;
      prevSliderTranslatedX.value = sliderTranslatedX.value =
        -selectedCardIdx.value * SLIDER_INTERVAL;
      runOnJS(setSelectedCard)(idx);
    },
    goToPrev: () => {
      'worklet';
      const idx = Math.max(0, selectedCardIdx.value - 1);
      selectedCardIdx.value = idx;
      prevSliderTranslatedX.value = sliderTranslatedX.value =
        -selectedCardIdx.value * SLIDER_INTERVAL;
      runOnJS(setSelectedCard)(idx);
    },
    goToIdx: (idx: number) => {
      'worklet';
      selectedCardIdx.value = idx;
      const translateX = -idx * SLIDER_INTERVAL;
      prevSliderTranslatedX.value = sliderTranslatedX.value = translateX;
      runOnJS(setSelectedCard)(idx);
    },
  };

  const panGesture =
    settingCard === -1
      ? Gesture.Pan()
          .onBegin(() => {
            sliderTranslatedX.value = prevSliderTranslatedX.value;
          })
          .onUpdate(e => {
            const translatedX = prevSliderTranslatedX.value + e.translationX;
            sliderTranslatedX.value = translatedX;
          })
          .onEnd(e => {
            if (e.velocityX > 800) {
              sliderController.goToPrev();
              return;
            } else if (e.velocityX < -800) {
              sliderController.goToNext();

              return;
            }

            if (sliderTranslatedX.value > 0) {
              prevSliderTranslatedX.value = sliderTranslatedX.value = 0;
              selectedCardIdx.value = 0;
            } else {
              const idx = clamp(
                Math.round(-sliderTranslatedX.value / SLIDER_INTERVAL),
                0,
                CARD_LEN,
              );
              sliderController.goToIdx(idx);
            }
          })
      : Gesture.Pan();

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
    <sliderContext.Provider
      value={{
        selectedCard,
        panGesture,
        animatedStyle,
        selectedCardIdx,
        sliderController,
      }}
    >
      {children}
    </sliderContext.Provider>
  );
}

export const useCardSliderContext = () => useContext(sliderContext);
