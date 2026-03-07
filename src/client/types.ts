import { CardDto } from '@/domain/card'
import { UserDto } from '@/domain/user'

export type AlertPending = null | {
  phone: string
  cardId: string
  cardName: string
}

export interface CardClient {
  create(dto: CardDto): Promise<CardDto | null>
  getById(id: string): Promise<CardDto | null>
  deleteById(id: string): Promise<boolean>
  update(
    dto: { id: string } & Partial<
      Pick<
        CardDto,
        | 'scan'
        | 'message'
        | 'phone'
        | 'title'
        | 'updatedAt'
        | 'updatedBy'
        | 'ownerList'
      >
    >,
  ): Promise<boolean>
}

export interface UserClient {
  create(dto: UserDto): Promise<boolean>
  update(
    dto: { id: string } & Partial<
      Pick<UserDto, 'cardIdList' | 'nickname' | 'phone'>
    >,
  ): Promise<boolean>
  getById(id: string): Promise<UserDto | null>
  deleteById(id: string): Promise<boolean>
}

export interface CacheClient {
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
  setActive(setting: boolean): void
  getActive(): boolean
  setNotice(setting: boolean): void
  getNotice(): boolean
  setAutoSet(setting: boolean): void
  getAutoSet(): boolean
}
