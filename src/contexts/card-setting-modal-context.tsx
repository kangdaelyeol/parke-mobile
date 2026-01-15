import { createContext, PropsWithChildren, useContext } from 'react';
import { Gesture, PanGesture } from 'react-native-gesture-handler';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { MODAL_HEIGHT } from '@/screens/home/constants';

interface CardSettingModalContext {
  animatedStyle: any;
  showOptionModal: () => void;
  hideOptionModal: () => void;
  gesturePan: PanGesture;
}

const cardSettingModalContext = createContext<CardSettingModalContext>(
  {} as CardSettingModalContext,
);

export const CardSettingModalProvider = ({ children }: PropsWithChildren) => {
  const prevTranslateY = useSharedValue(MODAL_HEIGHT);

  const modalTranslateY = useSharedValue(MODAL_HEIGHT);

  const showOptionModal = () => {
    'worklet';
    modalTranslateY.value = 0;
    prevTranslateY.value = 0;
  };

  const hideOptionModal = () => {
    'worklet';
    modalTranslateY.value = MODAL_HEIGHT;
    prevTranslateY.value = MODAL_HEIGHT;
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(modalTranslateY.value, {
            duration: 150,
            easing: Easing.out(Easing.cubic),
          }),
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
    <cardSettingModalContext.Provider
      value={{
        animatedStyle,
        showOptionModal,
        hideOptionModal,
        gesturePan,
      }}
    >
      {children}
    </cardSettingModalContext.Provider>
  );
};

export const useCardSettingModalContext = () =>
  useContext(cardSettingModalContext);
