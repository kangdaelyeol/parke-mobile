import { CardDto, CardLayout, CardTheme } from '@/domain/card'
import { CardState } from '@/services/types'
import { AnimatedViewModel } from '@/types/common'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { StyleProp, ViewStyle } from 'react-native'
import { PanGesture } from 'react-native-gesture-handler'
import { footerIconList } from '@home/config/footer.config'

interface MainState {
  selectedCardIdx: number
  isSetting: boolean
  // 수정 화면에 띄운 카드 (수정 중이 아니면 null)
  editingCard: CardState | null
  cards: CardState[]
  cardLength: number
}

interface MainAnimated {
  sliderStyle: StyleProp<ViewStyle>
  homeContentStyle: StyleProp<ViewStyle>
  moverStyle: StyleProp<ViewStyle>
  cardTitleStyle: StyleProp<ViewStyle>
}

interface MainActions {
  panGesture: PanGesture
}

interface CardComponentState {
  loading: boolean
  // 카드 수정 화면이 떠 있는지
  isSetting: boolean
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
  recordsPress: () => void
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
  // 운행 기록 이메일 (내 계정에 카드별로 저장)
  email: string
  // 수정 중인 값을 그대로 담은 미리보기 카드 (값이 바뀔 때만 새 객체)
  previewCard: HomeCardWebPreviewProps['card']
}

// 수정 화면 애니메이션은 카드 설정 컨텍스트의 진행값이 담당한다
type SettingCardAnimated = Record<string, never>

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
  emailInput: (val: string) => void
}

interface TodaySummaryState {
  deviceName: string
  bleScanCount: number
  phoneChangeCount: number
  batteryLevel: string
  // 마지막 감지 뒤 지난 시간(분)
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

// 카드 하나의 기능 (카드와 글래스 홈의 카드 정보 판이 함께 쓴다)
export interface HomeCardActions {
  // 삭제·번호 변경 중
  loading: boolean
  // 카드 수정 화면이 떠 있는지
  isSetting: boolean
  isSelected: boolean
  actions: Omit<CardActions, 'morePress'>
}

// 글래스 홈 카드 정보 판의 탭
export type CardInfoTab = 'info' | 'manage'

export interface HomeCardInfoProps {
  idx: number
  tab: CardInfoTab
  onTabChange: (tab: CardInfoTab) => void
}

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

// 아래 탭바: 두 테마가 같은 동작을 쓰고 모양만 다르다
interface FooterState {
  // 지금 보고 있는 탭 (footer.config의 key)
  focusedName: string
  // 카드 수정 중이면 탭바를 누를 수 없다
  isSetting: boolean
}

interface FooterActions {
  itemPress: (item: FooterItem) => void
}

interface FooterAnimated {
  // 카드 수정 중에는 아래로 내려가 숨는다
  containerStyle: StyleProp<ViewStyle>
}

export type FooterItem = (typeof footerIconList)[number]

export type HomeFooterViewModel = AnimatedViewModel<
  FooterState,
  FooterActions,
  FooterAnimated
>

export interface HomeFooterIconProps {
  iconSize: number
  label: string
  iconName: 'house' | 'user' | 'qrcode' | 'gear'
  // 지금 보고 있는 탭
  active: boolean
  onPress: () => void
}

export interface HomeSettingCardProps {
  card: CardState
}

export interface IllustrationSizeProps {
  width?: number
  height?: number
  // 선 색 (기본 흰색)
  color?: string
}

export interface HomeMainProps {
  // 카드 목록 동기화 중
  loading: boolean
}

export interface HomeCardWebPreviewProps {
  cardId: string
  // false인 동안은 웹뷰를 만들지 않고 빈 틀만 보여준다 (여는 애니메이션이 끊기지 않도록)
  active: boolean
  // 수정 중인 값 (DB card/{cardId}와 같은 모양)
  card: Pick<CardDto, 'title' | 'phone' | 'theme' | 'layout' | 'custom'>
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
