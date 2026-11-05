import {
  CompositeNavigationProp,
  NavigatorScreenParams,
} from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { DriveRecordDto } from '@/domain/drive'
import { DocType } from '@/types/common'

// 홈 아래 탭 (유리 탭바가 계속 떠 있는 화면들)
export type MainTabParamList = {
  HomeTab: undefined
  Profile: undefined
  Setting: undefined
}

export type RootStackParamList = {
  // 탭 화면 묶음. 처음에는 HomeTab이 열린다
  Home: NavigatorScreenParams<MainTabParamList> | undefined
  OnBoarding: undefined
  Init: undefined
  Login: undefined
  SearchBLE: undefined
  ScanComplete: { value: string }
  // 선택 동의 관리 (설정 → 위치정보 동의 철회)
  ConsentSetting: undefined
  Permission: undefined
  // cardId가 없으면 카드 없이 주행 (테스트용)
  Drive: { cardId?: string }
  // 카드별 주행 기록 목록 / 상세
  DriveRecords: { cardId: string }
  DriveRecord: { record: DriveRecordDto }
  LegalDoc: { docType: DocType }
}

type RootNavigationProp<T extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, T>

// 탭 화면에서는 다른 탭으로도, 루트 스택 화면(주행, 스캔 등)으로도 이동한다
type MainTabNavigationProp<T extends keyof MainTabParamList> =
  CompositeNavigationProp<
    BottomTabNavigationProp<MainTabParamList, T>,
    NativeStackNavigationProp<RootStackParamList>
  >

export type LoginStackNavigationProp = RootNavigationProp<'Login'>
export type HomeStackNavigationProp = MainTabNavigationProp<'HomeTab'>
export type InitStackNavigationProp = RootNavigationProp<'Init'>
export type OnBoardingStackNavigationProp = RootNavigationProp<'OnBoarding'>
export type ProfileStackNavigationProp = MainTabNavigationProp<'Profile'>
export type ScanCompleteStackNavigationProp = RootNavigationProp<'ScanComplete'>
export type SearchBleStackNavigationProp = RootNavigationProp<'SearchBLE'>
export type SettingStackNavigationProp = MainTabNavigationProp<'Setting'>
export type ConsentSettingStackNavigationProp =
  RootNavigationProp<'ConsentSetting'>
export type PermissionStackNavigationProp = RootNavigationProp<'Permission'>
export type DriveStackNavigationProp = RootNavigationProp<'Drive'>
export type DriveRecordsStackNavigationProp = RootNavigationProp<'DriveRecords'>
export type DriveRecordStackNavigationProp = RootNavigationProp<'DriveRecord'>
export type LegalDocStackNavigationProp = RootNavigationProp<'LegalDoc'>
