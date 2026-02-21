import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type LoginStackParamList = {
  Login: undefined;
  Init: undefined;
  Home: undefined;
};

export type LoginStackNavigationProp = NativeStackNavigationProp<
  LoginStackParamList,
  'Login'
>;

export type HomeStackParamList = {
  Home: undefined;
  Setting: undefined;
  Profile: undefined;
  SearchBLE: undefined;
  OnBoarding: undefined;
};

export type HomeStackNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'Home'
>;

export type InitStackParamList = {
  Init: undefined;
  Home: undefined;
};

export type InitStackNavigationProp = NativeStackNavigationProp<
  InitStackParamList,
  'Init'
>;

export type OnBoardingStackParamList = {
  OnBoarding: undefined;
  Login: undefined;
};

export type OnBoardingStackNavigationProp = NativeStackNavigationProp<
  OnBoardingStackParamList,
  'OnBoarding'
>;

export type ProfileStackParamList = {
  Profile: undefined;
  Home: undefined;
  Login: undefined;
};

export type ProfileStackNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  'Profile'
>;

export type ScanCompleteStackParamList = {
  ScanComplete: { value: string };
  Home: undefined;
};

export type ScanCompleteStackNavigationProp = NativeStackNavigationProp<
  ScanCompleteStackParamList,
  'ScanComplete'
>;

export type SearchBleStackParamList = {
  SearchBLE: undefined;
  Home: undefined;
  ScanComplete: { value: string };
};

export type SearchBleStackNavigationProp = NativeStackNavigationProp<
  SearchBleStackParamList,
  'SearchBLE'
>;

export type SettingStackParamList = {
  Setting: undefined;
  Home: undefined;
};

export type SettingStackNavigationProp =
  NativeStackNavigationProp<SettingStackParamList>;
