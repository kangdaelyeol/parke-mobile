import { CardDto } from '@/domain/card';
import { ViewModel } from '@/types/common';
import { StyleProp, ViewStyle } from 'react-native';
import { PanGesture } from 'react-native-gesture-handler';

interface MainState {
  sliderAnimatedStyle: StyleProp<ViewStyle>;
  animatedStyle: StyleProp<ViewStyle>;
  selectedCardIdx: number;
  isSetting: boolean;
  cards: CardDto[];
  cardLength: number;
  loading: boolean;
}

interface MainActions {
  panGesture: PanGesture;
}

export type MainViewModel = ViewModel<MainState, MainActions>;
