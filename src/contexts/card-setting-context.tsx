import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { Gesture, PanGesture } from 'react-native-gesture-handler';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { MODAL_HEIGHT } from '@/screens/home/constants';

interface CardSettingContext {
  animatedStyle: any;
  sliderAnimatedStyle: any;
  modalController: { showModal: () => void; hideModal: () => void };
  gesturePan: PanGesture;
  cardSettingController: {
    showSetting: (_: number) => void;
    hideSetting: () => void;
  };
  settingCard: number;
  setSettingCard: React.Dispatch<React.SetStateAction<number>>;
}

const cardSettingContext = createContext<CardSettingContext>(
  {} as CardSettingContext,
);
const SLIDER_MARGIN_TOP_ACTIVE = 10;
const SLIDER_MARGIN_TOP_INACTIVE = 220;

export const CardSettingProvider = ({ children }: PropsWithChildren) => {
  const prevTranslateY = useSharedValue(MODAL_HEIGHT);

  const modalTranslateY = useSharedValue(MODAL_HEIGHT);

  const sliderMarginTop = useSharedValue(SLIDER_MARGIN_TOP_INACTIVE);

  const [settingCard, setSettingCard] = useState(-1);

  const modalController = {
    showModal: () => {
      'worklet';
      modalTranslateY.value = 0;
      prevTranslateY.value = 0;
    },

    hideModal: () => {
      'worklet';
      modalTranslateY.value = MODAL_HEIGHT;
      prevTranslateY.value = MODAL_HEIGHT;
    },
  };

  const cardSettingController = {
    showSetting: (idx: number) => {
      setSettingCard(idx);
      sliderMarginTop.value = SLIDER_MARGIN_TOP_ACTIVE;
    },
    hideSetting: () => {
      setSettingCard(-1);
      sliderMarginTop.value = SLIDER_MARGIN_TOP_INACTIVE;
    },
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(modalTranslateY.value, {
            duration: 200,
            easing: Easing.out(Easing.cubic),
          }),
        },
      ],
    };
  });

  const sliderAnimatedStyle = useAnimatedStyle(() => {
    return {
      marginVertical: withTiming(sliderMarginTop.value, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      }),
    };
  });

  const gesturePan = Gesture.Pan()
    .onUpdate(e => {
      modalTranslateY.value = Math.max(
        0,
        prevTranslateY.value + e.translationY,
      );
    })
    .onEnd(() => {
      if (modalTranslateY.value > 30) {
        prevTranslateY.value = MODAL_HEIGHT;
        modalTranslateY.value = withTiming(MODAL_HEIGHT, {
          duration: 150,
          easing: Easing.out(Easing.circle),
        });
      } else {
        prevTranslateY.value = 0;
        modalTranslateY.value = withTiming(0, {
          duration: 100,
          easing: Easing.out(Easing.circle),
        });
      }
    });

  return (
    <cardSettingContext.Provider
      value={{
        animatedStyle,
        modalController,
        cardSettingController,
        gesturePan,
        settingCard,
        setSettingCard,
        sliderAnimatedStyle,
      }}
    >
      {children}
    </cardSettingContext.Provider>
  );
};

export const useCardSettingContext = () => useContext(cardSettingContext);
