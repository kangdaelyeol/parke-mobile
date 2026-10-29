import { ConsentMap } from '@/types/common'

export interface UserDto {
  id: string
  nickname: string
  phone: string
  cardIdList: string[]
  // 동의 기록 (user/{uid}/consents/{key})
  consents?: ConsentMap
  // 카드별 운행 기록 이메일 수신 주소 (user/{uid}/reportEmails/{cardId}).
  // 카드 노드는 누구나 읽을 수 있어 본인만 읽는 user 아래에 둔다
  reportEmails?: Record<string, string>
}
