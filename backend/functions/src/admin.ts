import { initializeApp } from 'firebase-admin/app'
import { getDatabase } from 'firebase-admin/database'
import { setGlobalOptions } from 'firebase-functions/v2'
import { CallableRequest, HttpsError } from 'firebase-functions/v2/https'

// 모든 함수 공통 설정. 다른 모듈보다 먼저 import 되어야 한다 (index.ts 첫 줄)
initializeApp()
setGlobalOptions({ region: 'asia-northeast3', maxInstances: 5 })

export const db = () => getDatabase()

export const requireUid = (request: CallableRequest<unknown>) => {
  const uid = request.auth?.uid
  if (!uid) throw new HttpsError('unauthenticated', '로그인이 필요합니다.')
  return uid
}
