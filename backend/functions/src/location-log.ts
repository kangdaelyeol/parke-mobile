import { ServerValue } from 'firebase-admin/database'
import { HttpsError, onCall } from 'firebase-functions/v2/https'
import { onSchedule } from 'firebase-functions/v2/scheduler'
import * as logger from 'firebase-functions/logger'
import { db, requireUid } from './admin'

/**
 * 위치정보 수집·이용·제공사실 확인자료 (위치정보법 제16조제2항)
 *
 * locationLog/{uid}/{id} = { type, at, purpose, recipient? }
 *  - collect_start / collect_end: 주행 모드 위치 수집 시작·종료
 *  - provide: 이용자가 지정한 제3자에게 제공 (운행 기록 이메일)
 *
 * 앱은 이 경로를 읽거나 쓸 수 없고(DB 기본 거부 규칙), 서버만 서버 시각으로 기록한다.
 * 6개월 보관 후 자동 삭제, 위치정보 동의 철회·회원 탈퇴 시 즉시 삭제.
 */

export type LocationLogType = 'collect_start' | 'collect_end' | 'provide'

const RETENTION_MS = 183 * 24 * 60 * 60 * 1000 // 약 6개월
const DRIVE_PURPOSE = '운행일지 작성 (주행 모드 위치 수집)'

export const appendLocationLog = (
  uid: string,
  entry: { type: LocationLogType; purpose: string; recipient?: string },
) =>
  db()
    .ref(`locationLog/${uid}`)
    .push({ ...entry, at: ServerValue.TIMESTAMP })

// 앱이 주행 모드 시작/종료 시 호출한다
export const logLocationAccess = onCall(async request => {
  const uid = requireUid(request)
  const type = (request.data as { type?: unknown } | null)?.type
  if (type !== 'collect_start' && type !== 'collect_end')
    throw new HttpsError('invalid-argument', '기록 종류가 올바르지 않습니다.')

  await appendLocationLog(uid, { type, purpose: DRIVE_PURPOSE })
  return { ok: true }
})

// 위치정보 동의 철회 시: 확인자료를 지체 없이 파기한다 (위치정보법 제24조)
// TODO: 운행 기록을 서버에 저장하게 되면 여기서 함께 삭제한다
export const deleteLocationData = onCall(async request => {
  const uid = requireUid(request)
  await db().ref(`locationLog/${uid}`).remove()
  logger.info('deleteLocationData', { uid })
  return { ok: true }
})

// 매일 새벽 4시: 보관 기간이 지난 확인자료와 지난 발송 횟수 기록을 삭제한다
export const purgeExpiredLocationLogs = onSchedule(
  { schedule: 'every day 04:00', timeZone: 'Asia/Seoul' },
  async () => {
    const cutoff = Date.now() - RETENTION_MS
    const updates: Record<string, null> = {}

    const logs = (await db().ref('locationLog').get()).val() as Record<
      string,
      Record<string, { at?: number }>
    > | null
    Object.entries(logs ?? {}).forEach(([uid, entries]) => {
      Object.entries(entries ?? {}).forEach(([id, entry]) => {
        if (typeof entry?.at === 'number' && entry.at < cutoff)
          updates[`locationLog/${uid}/${id}`] = null
      })
    })

    // 발송 횟수 카운터는 오늘 것만 필요하다
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(
      Date.now(),
    )
    const quotas = (await db().ref('reportQuota').get()).val() as Record<
      string,
      Record<string, number>
    > | null
    Object.entries(quotas ?? {}).forEach(([uid, days]) => {
      Object.keys(days ?? {}).forEach(day => {
        if (day < today) updates[`reportQuota/${uid}/${day}`] = null
      })
    })

    if (Object.keys(updates).length) await db().ref().update(updates)
    logger.info('purgeExpiredLocationLogs', { removed: Object.keys(updates).length })
  },
)
