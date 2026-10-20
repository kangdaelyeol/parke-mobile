import { CardDto, CardLayout, CardTheme } from '@/domain/card'
import { CardState } from '@/services/types'
import { AnimatedViewModel } from '@/types/common'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { StyleProp, ViewStyle } from 'react-native'
import { PanGesture } from 'react-native-gesture-handler'

interface MainState {
  selectedCardIdx: number
  isSetting: boolean
  cards: CardState[]
  cardLength: number
}

interface MainAnimated {
  sliderStyle: StyleProp<ViewStyle>
  moverStyle: StyleProp<ViewStyle>
  cardTitleStyle: StyleProp<ViewStyle>
}

interface MainActions {
  panGesture: PanGesture
}

interface CardComponentState {
  loading: boolean
  settingCard: number
  bottomSheetModalRef: React.RefObject<BottomSheetModal | null>
}

interface CardAnimated {
  cardStyle: StyleProp<ViewStyle>
  scanOnDotStyle: StyleProp<ViewStyle>
}

interface CardActions {
  drivePress: () => void
  cardPress: () => void
  editPress: () => void
  deletePress: (onDeleted?: () => void) => void
  previewPress: () => Promise<void>
  scanChangePress: () => void
  changePhonePress: () => Promise<void>
  morePress: () => void
}

interface EmptyCardAnimated {
  cardStyle: StyleProp<ViewStyle>
}

interface EmptyCardActions {
  cardPress: () => void
}

interface SettingCardState {
  title: string
  message: string
  phone: string
  theme: CardTheme
  layout: CardLayout
  accent: string
  scale: number
}

interface SettingCardAnimated {
  optionStyle: StyleProp<ViewStyle>
  buttonBarStyle: StyleProp<ViewStyle>
}

interface SettingCardActions {
  savePress: () => Promise<void>
  cancelPress: () => void
  titleInput: (val: string) => void
  messageInput: (val: string) => void
  phoneInput: (val: string) => void
  themePress: (val: CardTheme) => void
  layoutPress: (val: CardLayout) => void
  accentInput: (val: string) => void
  scaleChange: (val: number) => void
}

interface TodaySummaryState {
  deviceName: string
  bleScanCount: number
  phoneChangeCount: number
  batteryLevel: string
  lastScanTime: number
}

interface TodaySummaryAnimated {
  containerStyle: StyleProp<ViewStyle>
}

export type HomeMainViewModel = AnimatedViewModel<
  MainState,
  MainActions,
  MainAnimated
>

export type HomeCardViewModel = AnimatedViewModel<
  CardComponentState,
  CardActions,
  CardAnimated
>

export type HomeEmptyCardViewModel = AnimatedViewModel<
  {},
  EmptyCardActions,
  EmptyCardAnimated
>

export type HomeSettingCardViewModel = AnimatedViewModel<
  SettingCardState,
  SettingCardActions,
  SettingCardAnimated
>

export type HomeTodaySummaryViewModel = AnimatedViewModel<
  TodaySummaryState,
  {},
  TodaySummaryAnimated
>

export interface HomeCardOptionProps {
  card: CardState
}

export interface HomeCardProps {
  card: CardState
  idx: number
}

export interface HomeEmptyCardProps {
  idx: number
}

export interface HomeFooterIconProps {
  iconSize: number
  label: string
  iconName: 'user' | 'qrcode' | 'gear'
  onPress: () => void
}

export interface HomeSettingCardProps {
  card: CardDto
}

export interface IllustrationSizeProps {
  width?: number
  height?: number
}

export interface HomeLayoutSelectorProps {
  value: CardLayout
  onChange: (val: CardLayout) => void
}

export interface HomeThemeSelectorProps {
  value: CardTheme
  onChange: (val: CardTheme) => void
}

export interface HomeAccentPickerProps {
  value: string
  onChangeText: (val: string) => void
}

export interface HomeScaleStepperProps {
  value: number
  onChange: (val: number) => void
}
