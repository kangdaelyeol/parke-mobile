import {
  get,
  ref,
  serverTimestamp,
  set,
  update,
} from '@react-native-firebase/database'
import { db } from '@/firebaseApp'
import { UserDto } from '@/domain/user'
import { UserClient } from './types'
import { clientFail, clientOk } from '@/utils'

export const userClient: UserClient = {
  create: async dto => {
    try {
      await set(ref(db, `user/${dto.id}`), {
        ...dto,
        termsOfServiceAgreedAt: serverTimestamp(),
        privacyCollectionAgreedAt: serverTimestamp(),
        privacyThirdPartyAgreedAt: serverTimestamp(),
        ageVerificationAgreedAt: serverTimestamp(),
      })
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
      consents.forEach(({ docType, agreed, effectiveDate }) => {
        updates[`user/${id}/consents/${docType}`] = {
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
  getById: async id => {
    try {
      const key = id
      const snapShot = await get(ref(db, `user/${key}`))
      if (!snapShot.exists()) return clientOk(null)
      const userRaw = snapShot.val() as UserDto
      return clientOk(userRaw)
    } catch (e) {
      console.log(e)
      return clientFail(e)
    }
  },
}
