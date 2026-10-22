import { ConsentKey, DocType, ViewModel } from '@/types/common'

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
  key: ConsentKey
  // 볼 문서 (만 14세 확인은 없음)
  docType: DocType | null
  label: string
  agreed: boolean
  // 동의 시각 (ms)
  agreedAt: number | null
  // 개정 전 문서에 동의함 (선택 동의는 다시 동의해야 유효)
  outdated: boolean
}

interface ConsentActions {
  togglePress: (docType: DocType) => void
  docPress: (docType: DocType) => void
}

interface ConsentState {
  requiredItems: ConsentItem[]
  optionalItems: ConsentItem[]
  // 동의/철회 처리 중인 항목
  updating: ConsentKey | null
}

export type SettingConsentViewModel = ViewModel<ConsentState, ConsentActions>

export type SettingHeaderViewModel = ViewModel<{}, HeaderActions>

export type SettingMainViewModel = ViewModel<MainState, MainActions>
