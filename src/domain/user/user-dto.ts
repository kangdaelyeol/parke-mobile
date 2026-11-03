import { ConsentMap } from '@/types/common'

export interface UserDto {
  id: string
  nickname: string
  phone: string
  cardIdList: string[]
  // 동의 기록 (user/{uid}/consents/{key})
  consents?: ConsentMap
  // 내 이메일 (프로필에서 설정). 카드 이메일이 없을 때 운행 기록 이메일 기본값
  email?: string
}
