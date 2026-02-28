import { CardDto } from '@/domain/card';
import { UserDto } from '@/domain/user';
import { AnimatedViewModel, ViewModel } from '@/types/common';
import { StyleProp, ViewStyle } from 'react-native';
import { PanGesture } from 'react-native-gesture-handler';

interface MainState {
  selectedCardIdx: number;
  isSetting: boolean;
  cards: CardDto[];
  cardLength: number;
}

interface MainAnimated {
  sliderStyle: StyleProp<ViewStyle>;
  moverStyle: StyleProp<ViewStyle>;
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
  previewPress: () => Promise<void>;
  autoChangePress: () => Promise<void>;
  changePhonePress: () => Promise<void>;
}

interface CardAnimated {
  cardStyle: StyleProp<ViewStyle>;
}

interface CardActions {
  cardPress: () => void;
}

interface SettingCardState {
  title: string;
  message: string;
  phone: string;
}

interface SettingCardAnimated {
  optionStyle: StyleProp<ViewStyle>;
}

interface SettingCardActions {
  savePress: () => Promise<void>;
  cancelPress: () => void;
  titleInput: (val: string) => void;
  messageInput: (val: string) => void;
  phoneInput: (val: string) => void;
}

export type MainViewModel = AnimatedViewModel<
  MainState,
  MainActions,
  MainAnimated
>;

export type CardOptionViewModel = ViewModel<CardOptionState, CardOptionActions>;

export type CardViewModel = AnimatedViewModel<{}, CardActions, CardAnimated>;

export type SettingCardViewModel = AnimatedViewModel<
  SettingCardState,
  SettingCardActions,
  SettingCardAnimated
>;

export interface CardOptionProps {
  card: CardDto;
}

export interface CardProps {
  title: string;
  phone: string;
  idx: number;
  message: string;
  autoChange: boolean;
}

export interface EmptyCardProps {
  idx: number;
}

export interface FooterProps {
  label: string;
  iconName: any;
  onPress: () => void;
}

export interface SettingCardProps {
  card: CardDto;
}
