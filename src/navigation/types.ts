import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { DriveRecordDto } from '@/domain/drive'
import { DocType } from '@/types/common'

export type RootStackParamList = {
  Home: undefined
  OnBoarding: undefined
  Init: undefined
  Login: undefined
  SearchBLE: undefined
  ScanComplete: { value: string }
  Setting: undefined
  // 선택 동의 관리 (설정 → 위치정보 동의 철회)
  ConsentSetting: undefined
  Profile: undefined
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

export type LoginStackNavigationProp = RootNavigationProp<'Login'>
export type HomeStackNavigationProp = RootNavigationProp<'Home'>
export type InitStackNavigationProp = RootNavigationProp<'Init'>
export type OnBoardingStackNavigationProp = RootNavigationProp<'OnBoarding'>
export type ProfileStackNavigationProp = RootNavigationProp<'Profile'>
export type ScanCompleteStackNavigationProp = RootNavigationProp<'ScanComplete'>
export type SearchBleStackNavigationProp = RootNavigationProp<'SearchBLE'>
export type SettingStackNavigationProp = RootNavigationProp<'Setting'>
export type ConsentSettingStackNavigationProp =
  RootNavigationProp<'ConsentSetting'>
export type PermissionStackNavigationProp = RootNavigationProp<'Permission'>
export type DriveStackNavigationProp = RootNavigationProp<'Drive'>
export type DriveRecordsStackNavigationProp = RootNavigationProp<'DriveRecords'>
export type DriveRecordStackNavigationProp = RootNavigationProp<'DriveRecord'>
export type LegalDocStackNavigationProp = RootNavigationProp<'LegalDoc'>
