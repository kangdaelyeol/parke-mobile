import { db } from '@/firebaseApp'
import {
  get,
  ref,
  remove,
  serverTimestamp,
  set,
  update,
} from '@react-native-firebase/database'
import { ReactNativeFirebase } from '@react-native-firebase/app'
import { Card, CardDto } from '@/domain/card'
import { CardClient } from './types'

export const cardClient: CardClient = {
  create: async dto => {
    const entity = Card.fromDto(dto)
    const { id, title, phone, message, deviceId, ownerList } = entity.toDto()
    try {
      await set(ref(db, `card/${id}`), {
        id,
        title,
        phone,
        message,
        updatedAt: serverTimestamp(),
        deviceId,
        ownerList,
      })
    } catch (e) {
      console.log(e)
      return {
        status: false,
        error: e as ReactNativeFirebase.NativeFirebaseError,
      }
    }
    return { status: true, payload: dto }
  },
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
  deleteById: async id => {
    try {
      await remove(ref(db, `card/${id}`))
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
