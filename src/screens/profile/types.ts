import { LoginProvider } from '@/services/types'
import { ViewModel } from '@/types/common'

interface MainActions {
  nicknameInput: (v: string) => void
  phoneInput: (v: string) => void
  savePress: () => Promise<void>
  logoutPress: () => Promise<void>
  deletePress: () => Promise<void>
  emailInput: (v: string) => void
  clearReportEmailPress: () => void
}

interface MainState {
  loading: boolean
  nickname: string
  phone: string
  // 내 이메일 (user/{uid}/email)
  email: string
  // 이 기기에서 마지막으로 운행 기록을 보낸 주소
  reportEmail: string
  // 이 기기에서 로그인한 방식 (모르면 빈 값)
  loginProvider: LoginProvider | ''
}

export type ProfileMainViewModel = ViewModel<MainState, MainActions>
