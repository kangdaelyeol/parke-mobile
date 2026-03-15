import { AnimatedViewModel, ViewModel } from '@/types/common'
import { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native'

interface HeaderActions {
  backPress: () => void
}

interface RaderAnimated {
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
  dotStyle: StyleProp<ViewStyle>
  scanContainerStyle: StyleProp<ViewStyle>
}



export type SearchBleHeaderViewModel = ViewModel<{}, HeaderActions>

export type SearchBleRaderViewModel = AnimatedViewModel<{}, {}, RaderAnimated>

export type SearchBleTitleViewModel = AnimatedViewModel<
  {},
  TitleActions,
  TitleAnimated
>

