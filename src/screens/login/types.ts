import { ViewModel } from '@/types/common'
import { BottomSheetModal } from '@gorhom/bottom-sheet'

export type DocType = 'privacy' | 'terms' | 'consent' | 'consent-third'

interface LoginActions {
  kakaoLoginPress: () => Promise<void>
  allConfirmPress: () => void
  ageConfirmPress: () => void
  termConfirmPress: () => void
  consentConfirmPress: () => void
  thirdConsentConfirmPress: () => void
  showDocPress: (val: DocType) => void
}

interface LoginState {
  loading: boolean
  allConfirm: boolean
  ageConfirm: boolean
  termConfirm: boolean
  consentConfirm: boolean
  thirdConsentConfirm: boolean
  modalRef: React.RefObject<BottomSheetModal | null>
  docType: DocType
}

export type LoginViewModel = ViewModel<LoginState, LoginActions>
