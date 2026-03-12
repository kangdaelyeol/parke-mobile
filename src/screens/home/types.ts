import { CardDto } from '@/domain/card'
import { AnimatedViewModel } from '@/types/common'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { StyleProp, ViewStyle } from 'react-native'
import { PanGesture } from 'react-native-gesture-handler'

interface MainState {
  selectedCardIdx: number
  isSetting: boolean
  cards: CardDto[]
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

interface CardState {
  loading: boolean
  settingCard: number
  bottomSheetModalRef: React.RefObject<BottomSheetModal | null>
}

interface CardAnimated {
  cardStyle: StyleProp<ViewStyle>
  scanOnDotStyle: StyleProp<ViewStyle>
}

interface CardActions {
  cardPress: () => void
  editPress: () => void
  deletePress: () => void
  previewPress: () => Promise<void>
  scanChangePress: () => Promise<void>
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
}

interface SettingCardAnimated {
  optionStyle: StyleProp<ViewStyle>
}

interface SettingCardActions {
  savePress: () => Promise<void>
  cancelPress: () => void
  titleInput: (val: string) => void
  messageInput: (val: string) => void
  phoneInput: (val: string) => void
}

interface TodaySummaryState {
  deviceName: string
  bleScanCount: number
  phoneChangeCount: number
  batteryLevel: number
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
  CardState,
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
  card: CardDto
}

export interface HomeCardProps {
  title: string
  phone: string
  idx: number
  message: string
  scan: boolean
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
