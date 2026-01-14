import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { Gesture, PanGesture } from 'react-native-gesture-handler';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';

import { MODAL_HEIGHT } from '@/screens/home/constants';

interface cardOptionModalContextValueType {
  animatedStyle: any;
  showOptionModal: (idx: number) => void;
  hideOptionModal: () => void;
  gesturePan: PanGesture;
  selectedIdx: number;
}

const CardOptionModalContext = createContext<cardOptionModalContextValueType>(
  {} as cardOptionModalContextValueType,
);

export const CardOptionModalProvider = ({ children }: PropsWithChildren) => {
  const [selectedIdx, setSelectedCardIdx] = useState(-1);

  const prevTranslateY = useSharedValue(MODAL_HEIGHT);

  const modalTranslateY = useSharedValue(MODAL_HEIGHT);

  const showOptionModal = (idx: number) => {
    setSelectedCardIdx(idx);
    modalTranslateY.value = withTiming(0, {
      duration: 150,
      easing: Easing.out(Easing.circle),
    });
    prevTranslateY.value = 0;
  };

  const hideOptionModal = () => {
    setSelectedCardIdx(-1);
    modalTranslateY.value = withTiming(MODAL_HEIGHT, {
      duration: 150,
      easing: Easing.out(Easing.cubic),
    });
    prevTranslateY.value = MODAL_HEIGHT;
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: modalTranslateY.value,
        },
      ],
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
        runOnJS(setSelectedCardIdx)(-1);
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
    <CardOptionModalContext.Provider
      value={{
        animatedStyle,
        showOptionModal,
        hideOptionModal,
        gesturePan,
        selectedIdx,
      }}
    >
      {children}
    </CardOptionModalContext.Provider>
  );
};

export const useCardOptionModalContext = () =>
  useContext(CardOptionModalContext);
