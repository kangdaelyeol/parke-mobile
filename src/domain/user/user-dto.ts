import { ConsentRecord, DocType } from '@/types/common'

export interface UserDto {
  id: string
  nickname: string
  phone: string
  cardIdList: string[]
  // 문서별 동의 기록 (user/{uid}/consents/{docType})
  consents?: Partial<Record<DocType, ConsentRecord>>
}
