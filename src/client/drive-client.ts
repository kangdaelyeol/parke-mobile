import {
  get,
  push,
  ref,
  serverTimestamp,
  update,
} from '@react-native-firebase/database'
import { db } from '@/firebaseApp'
import { DrivePathDto, DriveRecordDto } from '@/domain/drive'
import { clientFail, clientOk, logger } from '@/utils'
import { DriveClient } from './types'

type StoredRecord = Omit<DriveRecordDto, 'id' | 'cardId'>

// 주행 기록은 위치정보라 공개 노드(card/)가 아닌 사용자별 노드에 둔다
export const driveClient: DriveClient = {
  // 요약과 경로를 한 번에 저장한다
  create: async (uid, { cardId, ...record }, path) => {
    try {
      const id = push(ref(db, `drive/${uid}/${cardId}`)).key
      if (!id) throw new Error('drive key not generated')
      await update(ref(db), {
        [`drive/${uid}/${cardId}/${id}`]: {
          ...record,
          createdAt: serverTimestamp(),
        },
        [`drivePath/${uid}/${id}`]: path,
      })
      return clientOk(id)
    } catch (e) {
      logger.error('[driveClient] create failed', e)
      return clientFail(e)
    }
  },
  // 최근 주행이 먼저
  listByCard: async (uid, cardId) => {
    try {
      const snapShot = await get(ref(db, `drive/${uid}/${cardId}`))
      const raw = (snapShot.val() ?? {}) as Record<string, StoredRecord>
      const records = Object.entries(raw)
        .map(([id, record]) => ({ ...record, id, cardId }))
        .sort((a, b) => b.startAt - a.startAt)
      return clientOk(records)
    } catch (e) {
      logger.error('[driveClient] listByCard failed', e)
      return clientFail(e)
    }
  },
  getPath: async (uid, driveId) => {
    try {
      const snapShot = await get(ref(db, `drivePath/${uid}/${driveId}`))
      return clientOk((snapShot.val() ?? []) as DrivePathDto)
    } catch (e) {
      logger.error('[driveClient] getPath failed', e)
      return clientFail(e)
    }
  },
  remove: async (uid, cardId, driveId) => {
    try {
      await update(ref(db), {
        [`drive/${uid}/${cardId}/${driveId}`]: null,
        [`drivePath/${uid}/${driveId}`]: null,
      })
      return clientOk(true)
    } catch (e) {
      logger.error('[driveClient] remove failed', e)
      return clientFail(e)
    }
  },
}
