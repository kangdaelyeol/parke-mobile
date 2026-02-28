import { AnimatedViewModel, ViewModel } from '@/types/common';
import { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';

interface HeaderActions {
  backPress: () => void;
}

interface RaderAnimated {
  dotSpinAnimatedStyle: StyleProp<ViewStyle>;
  lineAnimatedStyle: StyleProp<ViewStyle>;
  circleBigAnimatedStyle: StyleProp<ViewStyle>;
  circleSmallAnimatedStyle: StyleProp<ViewStyle>;
  dotAnimatedStyle: StyleProp<ViewStyle>;
  detectedCircleAnimatedStyle: StyleProp<ViewStyle>;
}

interface TitleActions {
  titleLayout: (e: LayoutChangeEvent) => void;
}

interface TitleAnimated {
  titleAnimatedStyle: StyleProp<ViewStyle>;
  subTitleAnimatedStyle: StyleProp<ViewStyle>;
}

interface ScreenStates {
  rssi: string;
  devices: any[];
}

export type SearchBleHeaderViewModel = ViewModel<{}, HeaderActions>;

export type SearchBleRaderViewModel = AnimatedViewModel<{}, {}, RaderAnimated>;

export type SearchBleTitleViewModel = AnimatedViewModel<{}, TitleActions, TitleAnimated>;

export type SearchBleScreenViewModel = ViewModel<ScreenStates, {}>;
