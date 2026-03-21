import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { DocType, ViewModel } from '@/types/common'

interface LoginActions {
  kakaoLoginPress: () => Promise<void>
  appleLoginPress: () => Promise<void>
  allConfirmPress: () => void
  ageConfirmPress: () => void
  termConfirmPress: () => void
  consentConfirmPress: () => void
  thirdConsentConfirmPress: () => void
  showDocPress: (val: DocType) => void
  termsAndConsentConfirmPress: () => void
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
  confirmSheetRef: React.RefObject<BottomSheetModal | null>
}

export type LoginContextValue = ViewModel<LoginState, LoginActions>
