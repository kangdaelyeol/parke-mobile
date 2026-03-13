import { AlertPending } from '@/client'
import { CardDto } from '@/domain/card'
import { UserDto } from '@/domain/user'
import { SearchBleStackNavigationProp } from '@/navigation/types'
import { BleManager } from 'react-native-ble-plx'

interface kakaoProfile {
  email: string
  nickname: string
}

export interface AuthService {
  firebaseLogin: (email: string, password: string) => Promise<string | null>
  firebaseSignIn: (email: string, password: string) => Promise<string | null>
  firebaseSignOut: () => Promise<void>
  firebaseDeleteUser: () => Promise<void>
  kakaoLogin: () => Promise<kakaoProfile | null>
  kakaoLogout: () => Promise<void>
  getKakaoProfile: () => Promise<kakaoProfile | null>
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
  pushAlertPending: ({ phone, cardId, cardName }: pushAlertPendingProp) => void
  deleteAlertPending: (cardId: string) => void
  clearAlertPending: () => void
  markAlertLastDeniedAt: () => void
  clearAlertLastDeniedAt: () => void
  getAlertLastDeniedAt: () => number
  markBleScan: (deviceName: string, batteryLevel: string) => void
  increasePhoneChangeCount: () => void
}

interface StartSearchBleProps {
  navigation: SearchBleStackNavigationProp
  setRssi: React.Dispatch<React.SetStateAction<string>>
  readonly cards: CardDto[]
}

interface StartBackgroundScanProps {
  readonly cards: CardDto[]
  readonly user: UserDto
  setCards: React.Dispatch<React.SetStateAction<CardDto[]>>
  refreshStateSession: () => void
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
    setCards,
    refreshStateSession,
  }: StartBackgroundScanProps) => Promise<void>
  startSearchBle: ({
    navigation,
    setRssi,
    cards,
  }: StartSearchBleProps) => Promise<void>
}

export interface CacheService {
  ensureInitialized: () => void
  setHasSeenOnBoarding: (value: boolean) => void
  getHasSeenOnBoarding: () => boolean
  getAndSetTodayDashBoard: () => void
  getTodayDashBoard: () => {
    batteryLevel: string
    bleScanCount: number
    phoneChangeCount: number
    lastScanDeviceName: string
    lastScanTime: number
  }
}

export interface CardService {
  get: (id: string) => Promise<CardDto | null>
  getList: (idList: string[]) => Promise<CardDto[] | null>
  update: (card: CardDto) => Promise<CardDto | null>
  create: (card: CardDto) => Promise<CardDto | null>
  delete: (cardId: string, userId: string) => Promise<boolean>
  updateScan: (id: string, scan: boolean) => Promise<boolean>
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
