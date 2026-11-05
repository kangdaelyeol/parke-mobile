import { CommonActions } from '@react-navigation/native'
import { RootStackParamList } from '@/navigation/types'

// 루트 스택을 name 화면 하나로 초기화한다 (로그아웃, 탈퇴 등).
// 탭 화면에서 dispatch해도 탭 네비게이터가 모르는 화면이라 루트 스택이 받아 처리한다
export const resetRoot = (name: keyof RootStackParamList) =>
  CommonActions.reset({ index: 0, routes: [{ name }] })
