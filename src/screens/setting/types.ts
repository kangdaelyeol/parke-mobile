import { DocType, ViewModel } from '@/types/common'

interface HeaderActions {
  backPress: () => void
}

interface MainActions {
  autoSetChange: (val: boolean) => void
  activeChange: (val: boolean) => void
  noticeChange: (val: boolean) => void
  docPress: (docType: DocType) => void
  consentSettingPress: () => void
  onBoardingPress: () => void
}

interface MainState {
  // 위치기반서비스 약관 + 개인위치정보 동의가 유효한지
  locationAgreed: boolean
  noticeDisabled: boolean
  autoSetDisabled: boolean
  notice: boolean
  autoSet: boolean
  active: boolean
}

export interface ConsentItem {
  docType: DocType
  label: string
  agreed: boolean
  // 유효한 동의의 동의 시각 (ms)
  agreedAt: number | null
}

interface ConsentActions {
  togglePress: (docType: DocType) => void
  docPress: (docType: DocType) => void
}

interface ConsentState {
  requiredItems: ConsentItem[]
  optionalItems: ConsentItem[]
  // 동의/철회 처리 중인 항목
  updating: DocType | null
}

export type SettingConsentViewModel = ViewModel<ConsentState, ConsentActions>

export type SettingHeaderViewModel = ViewModel<{}, HeaderActions>

export type SettingMainViewModel = ViewModel<MainState, MainActions>
