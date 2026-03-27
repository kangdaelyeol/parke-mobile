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
import { ReactNativeFirebase } from '@react-native-firebase/app'

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
      return { status: true, payload: true }
    } catch (e) {
      const error = e as ReactNativeFirebase.NativeFirebaseError
      return {
        status: false,
        error,
      }
    }
  },
  update: async dto => {
    const key = dto.id

    try {
      await update(ref(db, `user/${key}`), {
        ...dto,
      })
      return { status: true, payload: true }
    } catch (e) {
      console.log(e)
      const error = e as ReactNativeFirebase.NativeFirebaseError
      return { status: false, error }
    }
  },
  getById: async id => {
    try {
      const key = id
      const snapShot = await get(ref(db, `user/${key}`))
      if (!snapShot.exists()) return { status: true, payload: null }
      const userRaw = snapShot.val() as UserDto
      if (!userRaw.cardIdList) userRaw.cardIdList = []
      return { status: true, payload: userRaw }
    } catch (e) {
      console.log(e)
      const error = e as ReactNativeFirebase.NativeFirebaseError
      return { status: false, error }
    }
  },
  deleteById: async id => {
    try {
      const key = id
      await remove(ref(db, `user/${key}`))
      return { status: true, payload: true }
    } catch (e) {
      console.log(e)
      const error = e as ReactNativeFirebase.NativeFirebaseError
      return { status: false, error }
    }
  },
}
