import { ViewModel } from '@/types/common';
import { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';

interface HeaderActions {
  backPress: () => void;
}

interface RaderState {
  dotSpinAnimatedStyle: StyleProp<ViewStyle>;
  lineAnimatedStyle: StyleProp<ViewStyle>;
  circleBigAnimatedStyle: StyleProp<ViewStyle>;
  circleSmallAnimatedStyle: StyleProp<ViewStyle>;
  dotAnimatedStyle: StyleProp<ViewStyle>;
  detectedCircleAnimatedStyle: StyleProp<ViewStyle>;
}

interface TitleState {
  titleAnimatedStyle: StyleProp<ViewStyle>;
  subTitleAnimatedStyle: StyleProp<ViewStyle>;
}

interface TitleActions {
  titleLayout: (e: LayoutChangeEvent) => void;
}

export type SearchBLEHeaderViewModel = ViewModel<{}, HeaderActions>;

export type SearchBLERaderViewModel = ViewModel<RaderState, {}>;

export type SearchBLETitleViewModel = ViewModel<TitleState, TitleActions>;
