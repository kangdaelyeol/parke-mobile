import { AnimatedViewModel, ViewModel } from '@/types/common'
import { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native'

interface HeaderActions {
  backPress: () => void
}

interface RaderAnimated {
  dotSpinStyle: StyleProp<ViewStyle>
  lineStyle: StyleProp<ViewStyle>
  circleBigStyle: StyleProp<ViewStyle>
  circleSmallStyle: StyleProp<ViewStyle>
  dotStyle: StyleProp<ViewStyle>
  detectedCircleStyle: StyleProp<ViewStyle>
}

interface TitleActions {
  titleLayout: (e: LayoutChangeEvent) => void
}

interface TitleAnimated {
  titleStyle: StyleProp<ViewStyle>
  subTitleStyle: StyleProp<ViewStyle>
}

interface ScreenStates {
  rssi: string
}

export type SearchBleHeaderViewModel = ViewModel<{}, HeaderActions>

export type SearchBleRaderViewModel = AnimatedViewModel<{}, {}, RaderAnimated>

export type SearchBleTitleViewModel = AnimatedViewModel<
  {},
  TitleActions,
  TitleAnimated
>

export type SearchBleScreenViewModel = ViewModel<ScreenStates, {}>
