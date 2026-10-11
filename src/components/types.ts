import { StyleProp, ViewStyle } from 'react-native'
import { AnimatedViewModel } from '@/types/common'

export interface ToggleProps {
  value: boolean
  disabled?: boolean
  onValueChange: (val: boolean) => void
}

interface ToggleActions {
  handleTogglePress: () => void
}

interface ToggleAnimated {
  dotStyle: StyleProp<ViewStyle>
  backgroundStyle: StyleProp<ViewStyle>
}

export type ToggleViewModel = AnimatedViewModel<
  {},
  ToggleActions,
  ToggleAnimated
>
