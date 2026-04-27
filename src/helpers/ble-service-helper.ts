import { Buffer } from 'buffer'
import {
  NOTIFY_COOLDOWN_MS,
  RENEW_INTERVAL_MS,
  SCAN_COOLDOWN_MS,
  SIMULTANEOUS_INTERVAL_MS,
} from '@/constants'
import { CardDto } from '@/domain/card'
import { bleCacheService, settingService } from '@/services'

export const base64ToUtf = (b64str: string): string => {
  return Buffer.from(b64str, 'base64').toString('utf8')
}

export const generateSerialNumber = () => {
  return Buffer.from(Date.now().toString(36)).toString('base64')
}

export const getBatteryLevel = (manufacturer: string): string => {
  const buf = Buffer.from(manufacturer, 'base64')
  return String(buf[10])
}

export const getDeviceId = (manufacturer: string) => {
  return Buffer.from(manufacturer, 'base64').toString('utf8').slice(2, 10) // 8 length
}

export const canNotifySimultaneousConnection = (card: CardDto) => {
  const isRecentlyUpdated =
    Date.now() < Number(card.updatedAt) + RENEW_INTERVAL_MS
  const isNoticeEnabled = settingService.getSettings().notice
  const isAlertCooldownPassed =
    bleCacheService.getSimultaneousConnectionAlertAt() +
      SIMULTANEOUS_INTERVAL_MS <
    Date.now()

  return isRecentlyUpdated && isNoticeEnabled && isAlertCooldownPassed
}

export const isOwnCard = (userPhone: string, cardPhone: string) => {
  return String(userPhone) === String(cardPhone)
}

export const isAlertDeniedCooldownActive = () => {
  return (
    Date.now() < bleCacheService.getAlertLastDeniedAt() + NOTIFY_COOLDOWN_MS
  )
}

export const isScanCooldownActive = (deviceId: string) => {
  return (
    Date.now() - bleCacheService.getDeviceSeenAt(deviceId) < SCAN_COOLDOWN_MS
  )
}

export const canRenewPhoneNumber = (card: CardDto): boolean => {
  return Number(card.updatedAt) + RENEW_INTERVAL_MS < Date.now()
}
