import { ViewModel } from '@/types/common';
import { StyleProp, ViewStyle } from 'react-native';

interface HeaderActions {
  backPress: () => void;
}

export type SearchBLEHeaderViewModel = ViewModel<{}, HeaderActions>;

interface RaderState {
  dotSpinAnimatedStyle: StyleProp<ViewStyle>;
  lineAnimatedStyle: StyleProp<ViewStyle>;
  circleBigAnimatedStyle: StyleProp<ViewStyle>;
  circleSmallAnimatedStyle: StyleProp<ViewStyle>;
  dotAnimatedStyle: StyleProp<ViewStyle>;
  detectedCircleAnimatedStyle: StyleProp<ViewStyle>;
}

export type UseSearchBLERaderViewModel = ViewModel<RaderState, {}>;
