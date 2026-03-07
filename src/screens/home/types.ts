import { CardDto } from '@/domain/card'
import { UserDto } from '@/domain/user'
import { AnimatedViewModel, ViewModel } from '@/types/common'
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
}

interface MainActions {
  panGesture: PanGesture
}

interface CardOptionState {
  user: UserDto
  loading: boolean
}

interface CardOptionActions {
  editPress: () => void
  deletePress: () => void
  previewPress: () => Promise<void>
  scanChangePress: () => Promise<void>
  changePhonePress: () => Promise<void>
}

interface CardAnimated {
  cardStyle: StyleProp<ViewStyle>
}

interface CardActions {
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

export type HomeMainViewModel = AnimatedViewModel<
  MainState,
  MainActions,
  MainAnimated
>

export type HomeCardOptionViewModel = ViewModel<
  CardOptionState,
  CardOptionActions
>

export type HomeCardViewModel = AnimatedViewModel<{}, CardActions, CardAnimated>

export type SettingCardViewModel = AnimatedViewModel<
  SettingCardState,
  SettingCardActions,
  SettingCardAnimated
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

export interface HomeFooterProps {
  label: string
  iconName: any
  onPress: () => void
}

export interface HomeSettingCardProps {
  card: CardDto
}
