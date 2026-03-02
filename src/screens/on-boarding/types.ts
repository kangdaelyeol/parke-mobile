import { AnimatedViewModel, ViewModel } from '@/types/common';
import { StyleProp, ViewStyle } from 'react-native';
import { PanGesture } from 'react-native-gesture-handler';

interface ScreenState {
  loading: boolean;
}

interface FooterState {
  pageIdx: number;
}

interface FooterActions {
  nextPress: () => void;
  dotPress: (idx: number) => void;
  startPress: () => void;
}

interface SliderAnimated {
  sliderStyle: StyleProp<ViewStyle>;
}

interface SliderActions {
  panGesture: PanGesture;
}

export type OnBoardingScreenViewModel = ViewModel<ScreenState, {}>;
export type OnBoardingFooterViewModel = ViewModel<FooterState, FooterActions>;
export type OnBoardingSliderViewModel = AnimatedViewModel<
  {},
  SliderActions,
  SliderAnimated
>;
