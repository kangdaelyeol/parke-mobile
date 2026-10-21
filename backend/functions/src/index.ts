import { initializeApp } from 'firebase-admin/app'
import { getDatabase } from 'firebase-admin/database'
import { setGlobalOptions } from 'firebase-functions/v2'
import { HttpsError, onCall } from 'firebase-functions/v2/https'
import { defineSecret, defineString } from 'firebase-functions/params'
import * as logger from 'firebase-functions/logger'
import nodemailer from 'nodemailer'
import {
  buildDriveReport,
  DriveReportInput,
  LatLng,
  ROUTE_MAP_CID,
} from './report-template'

initializeApp()
setGlobalOptions({ region: 'asia-northeast3', maxInstances: 5 })

// 메일 발송 설정 (SMTP). 기본값은 Resend SMTP 기준
const SMTP_HOST = defineString('SMTP_HOST', { default: 'smtp.resend.com' })
const SMTP_PORT = defineString('SMTP_PORT', { default: '465' })
const SMTP_USER = defineString('SMTP_USER', { default: 'resend' })
const MAIL_FROM = defineString('MAIL_FROM', {
  default: 'Parké <no-reply@originalshq.com>',
})
// 비밀번호(API 키)는 시크릿으로만 보관: firebase functions:secrets:set SMTP_PASS
const SMTP_PASS = defineSecret('SMTP_PASS')

// 계정당 하루 발송 횟수 (스팸 방지)
const DAILY_LIMIT = 20
const MAX_IMAGE_BYTES = 2 * 1024 * 1024
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const fail = (message: string): never => {
  throw new HttpsError('invalid-argument', message)
}

const asNumber = (v: unknown, min: number, max: number, name: string) => {
  if (typeof v !== 'number' || !Number.isFinite(v)) fail(`${name} 값이 올바르지 않습니다.`)
  return Math.min(max, Math.max(min, v as number))
}

const asText = (v: unknown, maxLength: number, fallback: string) =>
  typeof v === 'string' && v.trim() ? v.trim().slice(0, maxLength) : fallback

const asPoint = (v: unknown): LatLng | null => {
  if (!v || typeof v !== 'object') return null
  const { lat, lng } = v as Record<string, unknown>
  if (typeof lat !== 'number' || typeof lng !== 'number') return null
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null
  return { lat, lng }
}

// 앱에서 온 값은 숫자/짧은 문자열만 받고, HTML은 서버에서 만든다
const parseInput = (data: unknown): DriveReportInput => {
  if (!data || typeof data !== 'object') fail('요청 형식이 올바르지 않습니다.')
  const d = data as Record<string, unknown>

  const email = typeof d.email === 'string' ? d.email.trim() : ''
  if (email.length > 254 || !EMAIL_RE.test(email)) fail('이메일 주소를 확인해주세요.')

  const startAt = asNumber(d.startAt, 0, Number.MAX_SAFE_INTEGER, 'startAt')
  const endAt = asNumber(d.endAt, startAt, startAt + 24 * 60 * 60 * 1000, 'endAt')

  let mapImage: string | null = null
  if (typeof d.mapImage === 'string' && d.mapImage) {
    mapImage = d.mapImage.replace(/^data:image\/\w+;base64,/, '')
    if ((mapImage.length * 3) / 4 > MAX_IMAGE_BYTES) fail('지도 이미지가 너무 큽니다.')
  }

  return {
    email,
    cardTitle: asText(d.cardTitle, 40, 'Parké'),
    driverName: asText(d.driverName, 30, '운전자'),
    startAt,
    endAt,
    distanceMeters: asNumber(d.distanceMeters, 0, 2_000_000, 'distanceMeters'),
    averageSpeedKmh: asNumber(d.averageSpeedKmh, 0, 400, 'averageSpeedKmh'),
    maxSpeedKmh: asNumber(d.maxSpeedKmh, 0, 400, 'maxSpeedKmh'),
    startPoint: asPoint(d.startPoint),
    endPoint: asPoint(d.endPoint),
    mapImage,
  }
}

// reportQuota/{uid}/{YYYY-MM-DD} 카운터로 하루 발송 횟수를 제한한다
const consumeDailyQuota = async (uid: string) => {
  const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(Date.now())
  const ref = getDatabase().ref(`reportQuota/${uid}/${day}`)
  const result = await ref.transaction(count => {
    const next = (typeof count === 'number' ? count : 0) + 1
    return next > DAILY_LIMIT ? undefined : next
  })
  if (!result.committed)
    throw new HttpsError(
      'resource-exhausted',
      `운행 기록은 하루 ${DAILY_LIMIT}번까지 보낼 수 있습니다.`,
    )
}

export const sendDriveReport = onCall(
  { secrets: [SMTP_PASS], memory: '256MiB', timeoutSeconds: 30 },
  async request => {
    const uid = request.auth?.uid
    if (!uid) throw new HttpsError('unauthenticated', '로그인이 필요합니다.')

    const input = parseInput(request.data)
    await consumeDailyQuota(uid)

    const { subject, html, text } = buildDriveReport(input)
    const port = Number(SMTP_PORT.value())
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST.value(),
      port,
      secure: port === 465,
      auth: { user: SMTP_USER.value(), pass: SMTP_PASS.value() },
    })

    try {
      await transporter.sendMail({
        from: MAIL_FROM.value(),
        to: input.email,
        subject,
        html,
        text,
        // 지도는 본문에 삽입되는 첨부(cid)로 넣는다 (data URI는 Gmail 등에서 막힌다)
        attachments: input.mapImage
          ? [
              {
                filename: 'route.jpg',
                content: Buffer.from(input.mapImage, 'base64'),
                contentType: 'image/jpeg',
                cid: ROUTE_MAP_CID,
              },
            ]
          : [],
      })
    } catch (e) {
      logger.error('sendDriveReport failed', { uid, error: String(e) })
      throw new HttpsError('internal', '메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.')
    }

    logger.info('sendDriveReport sent', { uid, hasMap: !!input.mapImage })
    return { ok: true }
  },
)
