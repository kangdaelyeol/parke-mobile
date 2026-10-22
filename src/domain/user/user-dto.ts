import { ConsentMap } from '@/types/common'

export interface UserDto {
  id: string
  nickname: string
  phone: string
  cardIdList: string[]
  // 동의 기록 (user/{uid}/consents/{key})
  consents?: ConsentMap
}
