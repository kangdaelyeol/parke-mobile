import { NativeStackNavigationProp } from '@react-navigation/native-stack'

export type RootStackParamList = {
  Home: undefined
  OnBoarding: undefined
  Init: undefined
  Login: undefined
  SearchBLE: undefined
  ScanComplete: { value: string }
  Setting: undefined
  Profile: undefined
  Permission: undefined
}

type RootNavigationProp<T extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, T>

export type LoginStackNavigationProp = RootNavigationProp<'Login'>
export type HomeStackNavigationProp = RootNavigationProp<'Home'>
export type InitStackNavigationProp = RootNavigationProp<'Init'>
export type OnBoardingStackNavigationProp = RootNavigationProp<'OnBoarding'>
export type ProfileStackNavigationProp = RootNavigationProp<'Profile'>
export type ScanCompleteStackNavigationProp = RootNavigationProp<'ScanComplete'>
export type SearchBleStackNavigationProp = RootNavigationProp<'SearchBLE'>
export type SettingStackNavigationProp = RootNavigationProp<'Setting'>
export type PermissionStackNavigationProp = RootNavigationProp<'Permission'>
