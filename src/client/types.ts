import { ReactNativeFirebase } from '@react-native-firebase/app'
import { CardDto } from '@/domain/card'
import { UserDto } from '@/domain/user'
import { DrivePathDto, DriveRecordDto } from '@/domain/drive'
import { LoginProvider } from '@/services/types'
import { ConsentKey } from '@/types/common'

export interface ClientSuccess<T> {
  status: true
  payload: T
}

export interface ClientFailure<E = unknown> {
  status: false
  error: E
}

type ClientResult<T, E> = ClientSuccess<T> | ClientFailure<E>

export type FirebaseResult<T> = ClientResult<
  T,
  ReactNativeFirebase.NativeFirebaseError
>

// 사용자 응답을 기다리는 번호 변경 요청
export interface PhoneChangePending {
  cardId: string
  cardName: string
  phone: string
}

export interface CardClient {
  getById(id: string): Promise<FirebaseResult<CardDto | null>>
  getAllowById(id: string): Promise<FirebaseResult<boolean | null>>
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
  // 빈 문자열이면 삭제
  setReportEmail(
    id: string,
    cardId: string,
    email: string,
  ): Promise<FirebaseResult<boolean>>
  // 동의 기록을 한 번에 저장 (agreedAt은 서버 시각)
  recordConsents(
    id: string,
    consents: { key: ConsentKey; agreed: boolean; effectiveDate: string }[],
  ): Promise<FirebaseResult<boolean>>
}

export interface DriveClient {
  create(
    uid: string,
    record: Omit<DriveRecordDto, 'id'>,
    path: DrivePathDto,
  ): Promise<FirebaseResult<string>>
  listByCard(
    uid: string,
    cardId: string,
  ): Promise<FirebaseResult<DriveRecordDto[]>>
  getPath(uid: string, driveId: string): Promise<FirebaseResult<DrivePathDto>>
  remove(
    uid: string,
    cardId: string,
    driveId: string,
  ): Promise<FirebaseResult<boolean>>
}

export interface CacheClient {
  clearDeviceRecords: (deviceId: string) => void
  clearUserRecords: () => void
  setLoginProvider: (v: string) => void
  getLoginProvider: () => LoginProvider | ''
  setAppleUser: (v: string) => void
  getAppleUser: () => string | null
  getLastReportEmail: () => string
  setLastReportEmail: (email: string) => void
  getHasInitializedCache(): boolean
  setHasInitializedCache(setting: boolean): void
  getHasSeenOnBoarding(): boolean
  setHasSeenOnBoarding(v: boolean): void
  getDeviceSeenAt(deviceId: string): number
  setDeviceSeenAt(deviceId: string, time: number): void
  getAlertDeniedAt(): number
  setAlertDeniedAt(time: number): void
  getAlertPendingList(): PhoneChangePending[]
  setAlertPending(pendingList: PhoneChangePending[]): void
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
