import {
  get,
  ref,
  serverTimestamp,
  set,
  update,
} from '@react-native-firebase/database'
import { db } from '@/firebaseApp'
import { UserDto } from '@/domain/user'
import { LEGACY_CONSENT_EFFECTIVE_DATE } from '@/constants'
import { ConsentKey, ConsentMap, ConsentRecord } from '@/types/common'
import { UserClient } from './types'
import { clientFail, clientOk } from '@/utils'

// 예전 스키마: 동의 시각을 user 바로 아래 필드로 저장했다
const LEGACY_CONSENT_FIELDS = {
  termsOfServiceAgreedAt: 'terms',
  privacyCollectionAgreedAt: 'consent',
  privacyThirdPartyAgreedAt: 'consent-third',
  ageVerificationAgreedAt: 'age',
  locationTermsAgreedAt: 'location',
  locationConsentAgreedAt: 'location-consent',
} as const satisfies Record<string, ConsentKey>

type LegacyConsentFields = Partial<
  Record<keyof typeof LEGACY_CONSENT_FIELDS, number>
>

// 예전 필드를 consents/{key}로 옮기고 지운다 (이미 consents에 있는 항목은 그대로 둔다)
const migrateLegacyConsents = async (
  raw: UserDto & LegacyConsentFields,
): Promise<UserDto> => {
  const { id } = raw
  const consents: ConsentMap = { ...raw.consents }
  const updates: Record<string, unknown> = {}
  const user: Record<string, unknown> = { ...raw }

  Object.entries(LEGACY_CONSENT_FIELDS).forEach(([field, key]) => {
    const agreedAt = raw[field as keyof LegacyConsentFields]
    if (agreedAt === undefined) return
    delete user[field]
    updates[`user/${id}/${field}`] = null
    if (consents[key]) return
    const record: ConsentRecord = {
      agreed: true,
      agreedAt,
      effectiveDate: key === 'age' ? '' : LEGACY_CONSENT_EFFECTIVE_DATE,
    }
    consents[key] = record
    updates[`user/${id}/consents/${key}`] = record
  })
  if (Object.keys(updates).length === 0) return raw

  try {
    await update(ref(db), updates)
  } catch (e) {
    // 옮기지 못해도 이번 실행에서는 변환한 값으로 쓰고, 다음에 다시 시도한다
    console.log('[userClient] consent migration failed', e)
  }
  return { ...(user as unknown as UserDto), consents }
}

export const userClient: UserClient = {
  create: async dto => {
    try {
      // 동의 기록(consents)은 로그인 흐름에서 recordConsents로 남긴다
      await set(ref(db, `user/${dto.id}`), dto)
      return clientOk(true)
    } catch (e) {
      return clientFail(e)
    }
  },
  update: async dto => {
    const key = dto.id

    try {
      await update(ref(db, `user/${key}`), {
        ...dto,
      })
      return clientOk(true)
    } catch (e) {
      console.log(e)
      return clientFail(e)
    }
  },
  // 동의 사실 확인 자료로 쓰이므로 동의 시각은 서버 시각으로 남긴다
  recordConsents: async (id, consents) => {
    try {
      const updates: Record<string, unknown> = {}
      consents.forEach(({ key, agreed, effectiveDate }) => {
        updates[`user/${id}/consents/${key}`] = {
          agreed,
          agreedAt: serverTimestamp(),
          effectiveDate,
        }
      })
      await update(ref(db), updates)
      return clientOk(true)
    } catch (e) {
      console.log(e)
      return clientFail(e)
    }
  },
  setReportEmail: async (id, cardId, email) => {
    try {
      await set(ref(db, `user/${id}/reportEmails/${cardId}`), email || null)
      return clientOk(true)
    } catch (e) {
      console.log(e)
      return clientFail(e)
    }
  },
  getById: async id => {
    try {
      const key = id
      const snapShot = await get(ref(db, `user/${key}`))
      if (!snapShot.exists()) return clientOk(null)
      const userRaw = snapShot.val() as UserDto & LegacyConsentFields
      return clientOk(await migrateLegacyConsents(userRaw))
    } catch (e) {
      console.log(e)
      return clientFail(e)
    }
  },
}
