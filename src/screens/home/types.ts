import { CardDto } from '@/domain/card';
import { UserDto } from '@/domain/user';
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

interface CardOptionState {
  user: UserDto;
  loading: boolean;
}

interface CardOptionActions {
  editPress: () => void;
  deletePress: () => void;
  previewPress: () => void;
  autoChangePress: () => Promise<void>;
  changePhonePress: () => Promise<void>;
}

export interface CardOptionProps {
  card: CardDto;
}

export type MainViewModel = ViewModel<MainState, MainActions>;

export type CardOptionViewModel = ViewModel<CardOptionState, CardOptionActions>;
