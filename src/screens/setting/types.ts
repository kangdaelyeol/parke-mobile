import { DocType, ViewModel } from '@/types/common'

interface HeaderActions {
  backPress: () => void
}

interface MainActions {
  autoSetChange: (val: boolean) => void
  activeChange: (val: boolean) => void
  noticeChange: (val: boolean) => void
  docPress: (docType: DocType) => void
  withdrawLocationPress: () => void
  onBoardingPress: () => void
}

interface MainState {
  // 위치기반서비스 약관 + 개인위치정보 동의가 유효한지
  locationAgreed: boolean
  withdrawing: boolean
  noticeDisabled: boolean
  autoSetDisabled: boolean
  notice: boolean
  autoSet: boolean
  active: boolean
}

export type SettingHeaderViewModel = ViewModel<{}, HeaderActions>

export type SettingMainViewModel = ViewModel<MainState, MainActions>
