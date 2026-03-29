import { ReactNativeFirebase } from '@react-native-firebase/app'
import { CardDto } from '@/domain/card'
import { UserDto } from '@/domain/user'
import { LoginProvider } from '@/services/types'

interface ClientSuccess<T> {
  status: true
  payload: T
}

interface ClientFailure<E = unknown> {
  status: false
  error: E
}

type ClientResult<T, E> = ClientSuccess<T> | ClientFailure<E>

export type FirebaseResult<T> = ClientResult<
  T,
  ReactNativeFirebase.NativeFirebaseError
>

export type AlertPending = null | {
  phone: string
  cardId: string
  cardName: string
}

export interface CardClient {
  create(dto: CardDto): Promise<FirebaseResult<CardDto>>
  getById(id: string): Promise<FirebaseResult<CardDto | null>>
  getAllowById(id: string): Promise<FirebaseResult<boolean | null>>
  deleteById(id: string): Promise<FirebaseResult<boolean>>
  update(
    dto: { id: string } & Partial<CardDto>,
  ): Promise<FirebaseResult<boolean>>
}

export interface UserClient {
  create(dto: UserDto): Promise<FirebaseResult<boolean>>
  update(
    dto: { id: string } & Partial<UserDto>,
  ): Promise<FirebaseResult<boolean>>
  getById(id: string): Promise<FirebaseResult<UserDto | null>>
  deleteById(id: string): Promise<FirebaseResult<boolean>>
}

export interface CacheClient {
  setLoginProvider: (v: string) => void
  getLoginProvider: () => LoginProvider | ''
  setAppleUser: (v: string) => void
  getAppleUser: () => string | null
  getHasInitializedCache(): boolean
  setHasInitializedCache(setting: boolean): void
  getHasSeenOnBoarding(): boolean
  setHasSeenOnBoarding(v: boolean): void
  getDeviceSeenAt(deviceId: string): number
  setDeviceSeenAt(deviceId: string, time: number): void
  getAlertDeniedAt(): number
  setAlertDeniedAt(time: number): void
  getAlertPendingList(): AlertPending[]
  setAlertPending(pendingList: AlertPending[]): void
  markSimultaneousConnectionAlertAt: () => void
  getSimultaneousConnectionAlertAt: () => number
  setActive(setting: boolean): void
  getActive(): boolean
  setNotice(setting: boolean): void
  getNotice(): boolean
  setAutoSet(setting: boolean): void
  getAutoSet(): boolean
  getToday: () => string
  setToday: (date: string) => void
  getBleScanCount: () => number
  setBleScanCount: (count: number) => void
  getPhoneChangeCount: () => number
  setPhoneChangeCount: (count: number) => void
  getBatteryLevel: () => string
  setBatteryLevel: (level: string) => void
  getLastScanDeviceName: () => string
  setLastScanDeviceName: (deviceName: string) => void
  getLastScanTime: () => number
  markLastScanTime: () => void
  getDeviceScan: (deviceId: string) => boolean
  setDeviceScan: (deviceId: string, scan: boolean) => void
}
