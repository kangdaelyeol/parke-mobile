import { BleManager } from 'react-native-ble-plx'
import { AlertPending } from '@/client'
import { CardDto } from '@/domain/card'
import { UserDto } from '@/domain/user'

interface kakaoProfile {
  email: string
  nickname: string
}

export interface AuthService {
  firebaseLogin: (email: string) => Promise<string | null>
  firebaseSignIn: (email: string) => Promise<string | null>
  firebaseSignOut: () => Promise<void>
  firebaseDeleteUser: () => Promise<void>
  appleLogin: () => Promise<string | null>
  appleLogout: () => void
  kakaoLogin: () => Promise<kakaoProfile | null>
  kakaoLogout: () => Promise<void>
  getKakaoProfile: () => Promise<kakaoProfile | null>
  autoLogin: () => Promise<string | null>
  signInOrLogin: (identifier: string) => Promise<string | null>
  signOut: () => Promise<boolean>
  clearAuth: () => Promise<void>
}

interface pushAlertPendingProp {
  readonly phone: string
  readonly cardId: string
  readonly cardName: string
}

export interface BleCacheService {
  markDeviceSeenAt: (deviceId: string) => void
  getDeviceSeenAt: (deviceId: string) => number
  getAlertPendingList: () => AlertPending[]
  getSimultaneousConnectionAlertAt: () => number
  markSimultaneousConnectionAlertAt: () => void
  pushAlertPending: ({ phone, cardId, cardName }: pushAlertPendingProp) => void
  deleteAlertPending: (cardId: string) => void
  clearAlertPending: () => void
  markAlertLastDeniedAt: () => void
  clearAlertLastDeniedAt: () => void
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

interface StartBackgroundScanProps {
  readonly cards: CardState[]
  readonly user: UserDto
  refreshStateSession: () => void
  onCardPhoneChange: (cardId: string, phone: string) => void
  onDBError: () => void
  onError: (e: any) => void
}

export interface BleService {
  initManager: () => void
  getManager: () => BleManager | null
  getSession: () => number
  updateSession: () => number
  getState: () => { isBackgroundScanning: boolean; isSearching: boolean }
  stopScan: (capturedSession: number) => Promise<void>
  startBackgroundScan: ({
    cards,
    user,
    refreshStateSession,
    onCardPhoneChange,
    onDBError,
    onError,
  }: StartBackgroundScanProps) => Promise<void>
  startSearchBle: ({
    cards,
    onError,
    onDuplicated,
    onDeviceFound,
    onRssiChange,
  }: StartSearchBleProps) => Promise<void>
}

export type LoginProvider = 'apple' | 'kakao'

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
  userNickname: string
}

export type CardState = CardDto & { scan: boolean }

export interface CardService {
  getCard: (id: string) => Promise<CardState | null>
  getList: (idList: string[]) => Promise<CardState[] | null>
  getAllow: (serial: string) => Promise<Boolean | null>
  updateCardInfo: (
    cardId: string,
    title: string,
    phone: string,
    message: string,
  ) => Promise<boolean>
  createCard: (input: CreateCardInput) => Promise<CardState | null>
  deleteCard: (cardId: string, userId: string) => Promise<boolean>
  updateScan: (deviceId: string, scan: boolean) => void
  updatePhone: (id: string, phone: string) => Promise<boolean>
  updateUpdatedAt: (id: string) => Promise<boolean>
}

export interface PermissionService {
  setupNotifications: () => Promise<void>
  ensureBluetoothPermission: () => Promise<boolean>
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
  get: (id: string) => Promise<UserDto | null>
  create: (
    user: { id: string } & Partial<
      Pick<UserDto, 'cardIdList' | 'id' | 'nickname' | 'phone'>
    >,
  ) => Promise<UserDto | null>
  updateNicknameAndPhone: (
    id: string,
    nickname: string,
    phone: string,
  ) => Promise<boolean>
  updateCardIdList: (id: string, cardList: string[]) => Promise<boolean>
  delete: (id: string) => Promise<boolean>
  deleteCard: (userId: string, cardId: string) => Promise<boolean>
}
