import { db } from '@/firebaseApp'
import {
  get,
  ref,
  serverTimestamp,
  update,
} from '@react-native-firebase/database'
import { ReactNativeFirebase } from '@react-native-firebase/app'
import { CardDto } from '@/domain/card'
import { CardClient } from './types'

export const cardClient: CardClient = {
  getById: async id => {
    try {
      const snapShot = await get(ref(db, `/card/${id}`))
      if (!snapShot.exists()) return { status: true, payload: null }

      const card = snapShot.val() as CardDto
      return { status: true, payload: card }
    } catch (e) {
      console.log(e)
      return {
        status: false,
        error: e as ReactNativeFirebase.NativeFirebaseError,
      }
    }
  },
  getAllowById: async id => {
    try {
      const snapShot = await get(ref(db, `allow/${id}`))
      if (!snapShot.exists()) return { status: true, payload: null }
      return { status: true, payload: snapShot.val() as boolean }
    } catch (e) {
      console.log(e)
      return {
        status: false,
        error: e as ReactNativeFirebase.NativeFirebaseError,
      }
    }
  },

  update: async dto => {
    const { id } = dto
    try {
      await update(ref(db, `card/${id}`), {
        ...dto,
        updatedAt: serverTimestamp(),
      })
      return {
        status: true,
        payload: true,
      }
    } catch (e) {
      console.log(e)
      return {
        status: false,
        error: e as ReactNativeFirebase.NativeFirebaseError,
      }
    }
  },
}
