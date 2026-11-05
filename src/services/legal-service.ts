import {
  LEGAL_DOC_BASE_URL,
  LEGAL_DOC_PATH_PREFIX,
  LEGAL_DOCS,
  LEGAL_EFFECTIVE_DATE,
  LOCATION_CONSENT_DOCS,
} from '@/constants'
import { ConsentMap, DocType } from '@/types/common'
import { userClient } from '@/client'
import { getFirebaseErrorMessage, serviceFail, serviceOk } from '@/utils'
import { LegalService } from './types'

// 문서 화면에서 읽은 시행일 (앱 실행 중에만 기억)
const seenEffectiveDates: Partial<Record<DocType, string>> = {}

// "시행일: 2026년 10월 22일" → "2026-10-22"
const parseEffectiveDate = (text: string) => {
  const [, year, month, day] =
    text.match(/(\d{4})\s*년\s*(\d{1,2})\s*월\s*(\d{1,2})\s*일/) ?? []
  if (!year || !month || !day) return null
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

export const legalService: LegalService = {
  getDocUrl: docType =>
    `${LEGAL_DOC_BASE_URL}${LEGAL_DOC_PATH_PREFIX}${LEGAL_DOCS[docType].path}`,
  isLegalDocUrl: url =>
    url.startsWith(`${LEGAL_DOC_BASE_URL}${LEGAL_DOC_PATH_PREFIX}`),
  rememberEffectiveDate: (docType, text) => {
    const date = parseEffectiveDate(text)
    if (date) seenEffectiveDates[docType] = date
    return date
  },
  // 문서 화면을 열지 않고 동의한 경우에는 앱에 둔 현재 시행일을 쓴다
  getEffectiveDate: docType =>
    seenEffectiveDates[docType] ?? LEGAL_EFFECTIVE_DATE,
  recordConsents: async (uid, keys, agreed) => {
    const consents = keys.map(key => ({
      key,
      agreed,
      // 만 14세 이상 확인은 문서가 없다
      effectiveDate: key === 'age' ? '' : legalService.getEffectiveDate(key),
    }))
    const res = await userClient.recordConsents(uid, consents)
    if (!res.status) return serviceFail(getFirebaseErrorMessage(res.error))

    // 서버 시각과 거의 같은 값으로 화면 상태를 바로 갱신할 수 있게 돌려준다
    const records: ConsentMap = {}
    consents.forEach(({ key, effectiveDate }) => {
      records[key] = { agreed, agreedAt: Date.now(), effectiveDate }
    })
    return serviceOk(records)
  },
  // 동의 기록이 없거나, 동의한 문서가 현재 시행일보다 이전 버전이면 재동의가 필요하다
  needsReconsent: record =>
    !record || !record.agreed || record.effectiveDate < LEGAL_EFFECTIVE_DATE,
  hasLocationConsent: consents =>
    LOCATION_CONSENT_DOCS.every(docType => {
      const record = consents?.[docType]
      return !!record && record.agreed && !legalService.needsReconsent(record)
    }),
}
