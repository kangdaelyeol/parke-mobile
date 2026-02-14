import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface CardSettingContext {
  sliderAnimatedStyle: StyleProp<ViewStyle>;
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
  const sliderMarginTop = useSharedValue(SLIDER_MARGIN_TOP_INACTIVE);

  const [settingCard, setSettingCard] = useState(-1);

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

  const sliderAnimatedStyle = useAnimatedStyle(() => {
    return {
      marginVertical: withTiming(sliderMarginTop.value, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      }),
    };
  });

  return (
    <cardSettingContext.Provider
      value={{
        cardSettingController,
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
