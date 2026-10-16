import { Buffer } from 'buffer'
import {
  CONFIRM_COOLDOWN_MS,
  RENEW_INTERVAL_MS,
  SCAN_COOLDOWN_MS,
  SIMULTANEOUS_INTERVAL_MS,
} from '@/constants'
import { CardDto } from '@/domain/card'

export const base64ToUtf = (b64str: string): string => {
  return Buffer.from(b64str, 'base64').toString('utf8')
}

export const generateSerialNumber = () => {
  return Buffer.from(Date.now().toString(36)).toString('base64')
}

/** Mnf Data spec
 * Company Id: 0 ~ 1
 * Serial Number: 2 ~ 9
 * Battery Level: 10
 */
export const getDeviceId = (manufacturer: string) => {
  return Buffer.from(manufacturer, 'base64').toString('utf8').slice(2, 10) // 8 length
}

export const getBatteryLevel = (manufacturer: string): string => {
  const buf = Buffer.from(manufacturer, 'base64')
  return String(buf[10])
}

export const canNotifySimultaneousConnection = (
  card: CardDto,
  noticeEnabled: boolean,
  lastAlertAt: number,
) => {
  const isRecentlyUpdated =
    Date.now() < Number(card.updatedAt) + RENEW_INTERVAL_MS
  const isAlertCooldownPassed =
    lastAlertAt + SIMULTANEOUS_INTERVAL_MS < Date.now()

  return isRecentlyUpdated && noticeEnabled && isAlertCooldownPassed
}

export const isOwnCard = (userPhone: string, cardPhone: string) => {
  return String(userPhone) === String(cardPhone)
}

export const isConfirmCooldownActive = (lastConfirmAt: number) => {
  return Date.now() < lastConfirmAt + CONFIRM_COOLDOWN_MS
}

export const isScanCooldownActive = (lastSeenAt: number) => {
  return Date.now() - lastSeenAt < SCAN_COOLDOWN_MS
}

export const canRenewPhoneNumber = (card: CardDto): boolean => {
  return Number(card.updatedAt) + RENEW_INTERVAL_MS < Date.now()
}
