import { BleManager } from 'react-native-ble-plx'
import { Event } from '@notifee/react-native'
import { PhoneChangePending } from '@/client'
import { CardDto, CardInfo } from '@/domain/card'
import { UserDto } from '@/domain/user'

interface kakaoProfile {
  email: string
  nickname: string
}

interface AuthResponse {
  status: boolean
  payload: string | null
}

export interface ServiceSuccess<T> {
  status: true
  payload: T
}

export interface ServiceFailure {
  status: false
  message: string
}

export type ServiceResponse<T> = ServiceSuccess<T> | ServiceFailure

export interface AuthService {
  firebaseLogin: (email: string) => Promise<AuthResponse>
  firebaseSignUp: (email: string) => Promise<AuthResponse>
  firebaseSignOut: () => Promise<void>
  firebaseDeleteUser: () => Promise<void>
  appleLogin: () => Promise<string | null>
  appleLogout: () => void
  kakaoLogin: () => Promise<kakaoProfile | null>
  kakaoLogout: () => Promise<void>
  googleLogin: () => Promise<{ uid: string; nickname: string } | null>
  googleLogout: () => Promise<void>
  getKakaoProfile: () => Promise<kakaoProfile | null>
  autoLogin: () => Promise<string | null>
  signInOrLogin: (identifier: string) => Promise<string | null>
  signOut: () => Promise<boolean>
  clearAuth: () => Promise<void>
}

export interface BleCacheService {
  markDeviceSeenAt: (deviceId: string) => void
  getDeviceSeenAt: (deviceId: string) => number
  getAlertPendingList: () => PhoneChangePending[]
  hasAlertPending: (cardId: string) => boolean
  getSimultaneousConnectionAlertAt: () => number
  markSimultaneousConnectionAlertAt: () => void
  pushAlertPending: (pending: PhoneChangePending) => void
  deleteAlertPending: (cardId: string) => void
  markAlertLastDeniedAt: () => void
  getAlertLastDeniedAt: () => number
  markBleScan: (deviceName: string, batteryLevel: string) => void
  increasePhoneChangeCount: () => void
  getDeviceScan: (deviceId: string) => boolean
  setDeviceScan: (deviceId: string, scan: boolean) => void
}

interface StartSearchBleProps {
  readonly cards: CardState[]
  onError: (e: any) => void
  onDuplicated: () => void
  onDeviceFound: (val: string) => void
  onRssiChange: (val: string) => void
}

// 백그라운드 스캔이 기기를 감지했을 때 쓰는 최신 상태와 콜백
export interface BackgroundScanContext {
  readonly cards: CardState[]
  readonly user: UserDto
  refreshStateSession: () => void
  onCardPhoneChange: (cardId: string, phone: string) => void
  // 자동변경이 꺼져 있을 때, 앱 화면에서 변경 여부를 묻는다
  onPhoneChangeRequest: (pending: PhoneChangePending) => void
  onPermissionDenied: () => void
  onDBError: (message: string) => void
  onError: (e: any) => void
}

export interface BleService {
  initManager: () => void
  getManager: () => BleManager
  setBackgroundContext: (context: BackgroundScanContext | null) => void
  // 현재 컨텍스트와 설정을 보고 백그라운드 스캔을 켜거나 끈다
  refreshBackgroundScan: () => Promise<void>
  isBackgroundScanning: () => boolean
  subscribe: (listener: () => void) => () => void
  startSearchBle: (props: StartSearchBleProps) => Promise<void>
  stopSearchBle: () => Promise<void>
}

export type LoginProvider = 'apple' | 'kakao' | 'google'

export interface CacheService {
  ensureInitialized: () => void
  setHasSeenOnBoarding: (value: boolean) => void
  getHasSeenOnBoarding: () => boolean
  ensureTodayDashBoardCache: () => void
  getTodayDashBoard: () => {
    batteryLevel: string
    bleScanCount: number
    phoneChangeCount: number
    lastScanDeviceName: string
    lastScanTime: number
  }
  getAppleUser: () => string | null
  setAppleUser: (v: string) => void
  clearAppleUser: () => void
  setLoginProvider: (v: LoginProvider) => void
  getLoginProvider: () => LoginProvider | ''
  clearLoginProvider: () => void
}

interface CreateCardInput {
  id: string
  phone: string
  message: string
  title: string
  deviceId: string
  userId: string
  newCardIdList: string[]
}

export type CardState = CardDto & { scan: boolean }

export interface CardService {
  getCard: (id: string) => Promise<ServiceResponse<CardState>>
  findCard: (id: string) => Promise<ServiceResponse<CardDto | null>>
  getList: (idList: string[]) => Promise<ServiceResponse<CardState[] | null>>
  getAllow: (serial: string) => Promise<ServiceResponse<Boolean | null>>
  updateCardInfo: (
    cardId: string,
    info: CardInfo,
  ) => Promise<ServiceResponse<boolean>>
  createCard: (input: CreateCardInput) => Promise<ServiceResponse<CardState>>
  deleteCard: (
    cardId: string,
    userId: string,
  ) => Promise<ServiceResponse<boolean>>
  updateScan: (deviceId: string, scan: boolean) => void
  updatePhone: (id: string, phone: string) => Promise<ServiceResponse<boolean>>
  updateUpdatedAt: (id: string) => Promise<ServiceResponse<boolean>>
}

export type PhoneChangeEventResult =
  | { type: 'confirmed'; cardId: string; phone: string }
  | { type: 'rejected'; cardId: string }
  | { type: 'failed'; message: string }

export interface PhoneChangeService {
  confirm: (cardId: string, phone: string) => Promise<ServiceResponse<boolean>>
  reject: (cardId: string) => void
  handleNotificationEvent: (
    event: Event,
  ) => Promise<PhoneChangeEventResult | null>
}

export interface PermissionService {
  setupNotifications: () => Promise<void>
  ensureBluetoothPermission: () => Promise<boolean>
  isBluetoothGranted: () => Promise<boolean>
  ensureLocationPermission: () => Promise<boolean>
  ensureCameraPermission: () => Promise<boolean>
  ensureNotificationPermission: () => Promise<boolean>
}

interface SettingValue {
  readonly notice: boolean
  readonly autoSet: boolean
  readonly active: boolean
}

export interface SettingService {
  getSettings: () => SettingValue
  setNotice: (val: boolean) => void
  setAutoSet: (val: boolean) => void
  setActive: (val: boolean) => void
}

export interface UserService {
  getUser: (id: string) => Promise<ServiceResponse<UserDto>>
  createUser: (
    user: { id: string } & Partial<
      Pick<UserDto, 'cardIdList' | 'id' | 'nickname' | 'phone'>
    >,
  ) => Promise<ServiceResponse<UserDto>>
  updateNicknameAndPhone: (
    id: string,
    nickname: string,
    phone: string,
  ) => Promise<ServiceResponse<boolean>>
  updateCardIdList: (
    id: string,
    cardIdList: string[],
  ) => Promise<ServiceResponse<boolean>>
  deleteUser: (
    id: string,
    cardList: CardState[],
  ) => Promise<ServiceResponse<boolean>>
}
