import { ConsentKey, DocType, ViewModel } from '@/types/common'
import { AppTheme, ThemeId } from '@/theme/themes'

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
  // 테마 고르기 / 테마에 담긴 컴포넌트 전체 보기
  themeSelect: (id: ThemeId) => void
  themeGalleryPress: (id: ThemeId) => void
  // 현재 버전을 누르면 변경 내역으로
  versionPress: () => void
}

interface MainState {
  // 위치기반서비스 약관 + 개인위치정보 동의가 유효한지
  locationAgreed: boolean
  noticeDisabled: boolean
  autoSetDisabled: boolean
  notice: boolean
  autoSet: boolean
  active: boolean
  themes: AppTheme[]
  themeId: ThemeId
  // [개발용] 구성 요소 보기 줄을 보일지
  showThemeGallery: boolean
  // 앱의 현재 버전 (예: 1.3.0 Beta)
  appVersion: string
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
