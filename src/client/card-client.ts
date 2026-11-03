import { db } from '@/firebaseApp'
import {
  get,
  ref,
  serverTimestamp,
  set,
  update,
} from '@react-native-firebase/database'
import { CardDto } from '@/domain/card'
import { CardClient } from './types'
import { clientFail, clientOk } from '@/utils'

export const cardClient: CardClient = {
  getEmail: async id => {
    try {
      const snapShot = await get(ref(db, `cardPrivate/${id}/email`))
      return clientOk((snapShot.val() as string | null) ?? '')
    } catch (e) {
      console.log(e)
      return clientFail(e)
    }
  },
  setEmail: async (id, email) => {
    try {
      await set(ref(db, `cardPrivate/${id}/email`), email || null)
      return clientOk(true)
    } catch (e) {
      console.log(e)
      return clientFail(e)
    }
  },
  getById: async id => {
    try {
      const snapShot = await get(ref(db, `/card/${id}`))
      if (!snapShot.exists()) return clientOk(null)

      const card = snapShot.val() as CardDto
      return clientOk(card)
    } catch (e) {
      console.log(e)
      return clientFail(e)
    }
  },
  getAllowById: async id => {
    try {
      const snapShot = await get(ref(db, `allow/${id}`))
      if (!snapShot.exists()) return clientOk(null)
      return clientOk(snapShot.val() as boolean)
    } catch (e) {
      console.log(e)
      return clientFail(e)
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
      return clientFail(e)
    }
  },
}
