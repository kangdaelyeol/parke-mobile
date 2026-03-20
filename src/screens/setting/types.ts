import { AnimatedViewModel, ViewModel } from '@/types/common'
import { StyleProp, ViewStyle } from 'react-native'

interface HeaderActions {
  backPress: () => void
}

interface MainActions {
  autoSetChange: (val: boolean) => void
  activeChange: (val: boolean) => void
  noticeChange: (val: boolean) => void
  privacyPress: () => void
  termsPress: () => void
  consentPress: () => void
  consentThirdPress: () => void
}

interface MainState {
  noticeDisabled: boolean
  autoSetDisabled: boolean
  notice: boolean
  autoSet: boolean
  active: boolean
}

interface ToggleActions {
  handleTogglePress: () => void
}

interface ToggleAnimated {
  dotStyle: StyleProp<ViewStyle>
  backgroundStyle: StyleProp<ViewStyle>
}

export type SettingHeaderViewModel = ViewModel<{}, HeaderActions>

export type SettingMainViewModel = ViewModel<MainState, MainActions>

export type SettingToggleViewModel = AnimatedViewModel<
  {},
  ToggleActions,
  ToggleAnimated
>
