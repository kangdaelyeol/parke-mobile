import { driveClient } from '@/client'
import { DrivePathDto } from '@/domain/drive'
import { getFirebaseErrorMessage, serviceFail, serviceOk } from '@/utils'
import { DriveRecordService } from './types'

// 경로는 이 개수 이하로 줄여 저장한다 (1초마다 받으면 1시간에 수천 개)
const MAX_PATH_POINTS = 1000

const round6 = (n: number) => Math.round(n * 1e6) / 1e6

// 처음과 끝을 지키면서 고르게 골라낸다. 소수점 6자리 ≈ 0.1m
const toPath = (
  points: { latitude: number; longitude: number }[],
): DrivePathDto => {
  if (points.length === 0) return []
  const step = Math.max(1, (points.length - 1) / (MAX_PATH_POINTS - 1))
  const picked = []
  for (let i = 0; i < points.length - 1; i += step)
    picked.push(points[Math.floor(i)])
  picked.push(points[points.length - 1])
  return picked.map(p => [round6(p.latitude), round6(p.longitude)])
}

export const driveRecordService: DriveRecordService = {
  save: async (uid, { points, ...record }) => {
    const res = await driveClient.create(uid, record, toPath(points))
    if (!res.status) return serviceFail(getFirebaseErrorMessage(res.error))
    return serviceOk(res.payload)
  },
  listByCard: async (uid, cardId) => {
    const res = await driveClient.listByCard(uid, cardId)
    if (!res.status) return serviceFail(getFirebaseErrorMessage(res.error))
    return serviceOk(res.payload)
  },
  getPath: async (uid, driveId) => {
    const res = await driveClient.getPath(uid, driveId)
    if (!res.status) return serviceFail(getFirebaseErrorMessage(res.error))
    return serviceOk(res.payload)
  },
  remove: async (uid, cardId, driveId) => {
    const res = await driveClient.remove(uid, cardId, driveId)
    if (!res.status) return serviceFail(getFirebaseErrorMessage(res.error))
    return serviceOk(true)
  },
}
