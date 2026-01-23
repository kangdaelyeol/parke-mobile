import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';
import {
  clamp,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, PanGesture } from 'react-native-gesture-handler';
import { DefaultStyle } from 'react-native-reanimated/lib/typescript/hook/commonTypes';
import { runOnJS } from 'react-native-worklets';
import { useCardSettingContext } from '@/contexts/card-setting-context';
import { CARD_WIDTH, SLIDER_GAP } from '@/screens/home/constants';
import { useUserContext } from '@/contexts';

interface SliderController {
  goToNext: () => void;
  goToPrev: () => void;
  goToIdx: (idx: number) => void;
}

interface SliderContext {
  panGesture: PanGesture;
  animatedStyle: DefaultStyle;
  sliderController: SliderController;
  selectedCard: number;
}

const sliderContext = createContext({} as SliderContext);

export const SliderContextProvider = ({ children }: PropsWithChildren) => {
  const user = useUserContext();
  const { settingCard } = useCardSettingContext();
  const { cards } = user;
  const CARD_LEN = cards && cards.length;

  const prevSliderTranslatedX = useSharedValue(0);

  const sliderTranslatedX = useSharedValue(0);

  const [selectedCard, setSelectedCard] = useState(0);

  const SLIDER_INTERVAL = CARD_WIDTH + SLIDER_GAP;

  const sliderController = {
    goToNext: () => {
      'worklet';
      const idx = Math.min(CARD_LEN, selectedCard + 1);
      prevSliderTranslatedX.value = sliderTranslatedX.value =
        -idx * SLIDER_INTERVAL;
      runOnJS(setSelectedCard)(idx);
    },
    goToPrev: () => {
      'worklet';
      const idx = Math.max(0, selectedCard - 1);
      prevSliderTranslatedX.value = sliderTranslatedX.value =
        -idx * SLIDER_INTERVAL;
      runOnJS(setSelectedCard)(idx);
    },
    goToIdx: (idx: number) => {
      'worklet';
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
              runOnJS(setSelectedCard)(0);
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
        sliderController,
      }}
    >
      {children}
    </sliderContext.Provider>
  );
};

export const useCardSliderContext = () => useContext(sliderContext);
