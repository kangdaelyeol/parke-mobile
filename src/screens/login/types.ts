import { ViewModel } from '@/types/common'

interface LoginActions {
  kakaoLoginPress: () => Promise<void>
  allConfirmPress: () => void
  ageConfirmPress: () => void
  termConfirmPress: () => void
  consentConfirmPress: () => void
  thirdConsentConfirmPress: () => void
}

interface LoginState {
  loading: boolean
  allConfirm: boolean
  ageConfirm: boolean
  termConfirm: boolean
  consentConfirm: boolean
  thirdConsentConfirm: boolean
}

export type LoginViewModel = ViewModel<LoginState, LoginActions>
