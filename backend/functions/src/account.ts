import { getAuth } from 'firebase-admin/auth'
import { HttpsError, onCall } from 'firebase-functions/v2/https'
import * as logger from 'firebase-functions/logger'
import { db, requireUid } from './admin'

interface CardRecord {
  phone?: string
  ownerList?: string[]
}

interface UserRecord {
  phone?: string
  cardIdList?: string[]
}

/**
 * uid가 카드에서 빠질 때의 변경 내용을 updates에 담는다.
 *  - 남은 소유자가 없으면 카드와 카드 비공개 정보(cardPrivate, 이메일)를 삭제한다.
 *  - 남은 소유자가 있으면 소유자 목록에서만 빠지고,
 *    카드(QR 화면)에 떠나는 사람의 번호가 남아 있으면 남은 소유자 번호로 바꾼다.
 *    (기기 감지 기록 = 카드의 번호·감지 시각은 연결 해제·탈퇴 시까지만 보관)
 */
const collectCardLeave = async (
  uid: string,
  userPhone: string,
  cardId: string,
  updates: Record<string, unknown>,
) => {
  const card = (await db().ref(`card/${cardId}`).get()).val() as CardRecord | null
  if (!card) return

  const owners = (card.ownerList ?? []).filter(id => id !== uid)
  if (owners.length === 0) {
    updates[`card/${cardId}`] = null
    updates[`cardPrivate/${cardId}`] = null
    return
  }

  updates[`card/${cardId}/ownerList`] = owners
  if (userPhone && String(card.phone) === String(userPhone)) {
    const next = (
      await db().ref(`user/${owners[0]}/phone`).get()
    ).val() as string | null
    updates[`card/${cardId}/phone`] = next ?? ''
  }
}

// 카드(기기) 연결 해제
export const leaveCard = onCall(async request => {
  const uid = requireUid(request)
  const cardId = (request.data as { cardId?: unknown } | null)?.cardId
  if (typeof cardId !== 'string' || !cardId)
    throw new HttpsError('invalid-argument', '카드 정보가 올바르지 않습니다.')

  const user = (await db().ref(`user/${uid}`).get()).val() as UserRecord | null
  if (!user) throw new HttpsError('not-found', '회원 정보를 찾을 수 없습니다.')

  const updates: Record<string, unknown> = {}
  await collectCardLeave(uid, user.phone ?? '', cardId, updates)
  updates[`user/${uid}/cardIdList`] = (user.cardIdList ?? []).filter(id => id !== cardId)

  await db().ref().update(updates)
  logger.info('leaveCard', { uid, cardId })
  return { ok: true }
})

// 회원 탈퇴: 서버에 남는 이 사용자의 데이터를 모두 정리하고 로그인 계정까지 삭제한다
export const deleteAccount = onCall(async request => {
  const uid = requireUid(request)
  const user = ((await db().ref(`user/${uid}`).get()).val() ?? {}) as UserRecord

  const updates: Record<string, unknown> = {}
  for (const cardId of user.cardIdList ?? [])
    await collectCardLeave(uid, user.phone ?? '', cardId, updates)

  // 회원 정보(동의 기록 포함), 주행 기록, 발송 횟수, 위치정보 확인자료
  updates[`user/${uid}`] = null
  updates[`drive/${uid}`] = null
  updates[`drivePath/${uid}`] = null
  updates[`reportQuota/${uid}`] = null
  updates[`locationLog/${uid}`] = null
  await db().ref().update(updates)

  try {
    await getAuth().deleteUser(uid)
  } catch (e) {
    // 이미 지워진 계정이면 데이터 정리만으로 충분하다
    if ((e as { code?: string }).code !== 'auth/user-not-found') throw e
  }

  logger.info('deleteAccount', { uid })
  return { ok: true }
})
