import {
  get,
  ref,
  remove,
  serverTimestamp,
  set,
  update,
} from '@react-native-firebase/database'
import { db } from '@/firebaseApp'
import { UserDto } from '@/domain/user'
import { UserClient } from './types'

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
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  },
  update: async dto => {
    const key = dto.id

    try {
      await update(ref(db, `user/${key}`), {
        ...dto,
      })
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  },
  getById: async id => {
    try {
      const key = id
      const snapShot = await get(ref(db, `user/${key}`))
      if (!snapShot.exists()) return null
      const userRaw = snapShot.val()
      if (!userRaw.cardIdList) userRaw.cardIdList = []
      return userRaw as UserDto
    } catch (e) {
      console.log(e)
      return null
    }
  },
  deleteById: async id => {
    try {
      const key = id
      await remove(ref(db, `user/${key}`))
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  },
}
