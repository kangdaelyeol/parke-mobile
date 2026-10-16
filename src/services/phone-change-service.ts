import { EventType } from '@notifee/react-native'
import { PHONE_CHANGE_ACTION } from '@/constants'
import { extractNumber } from '@/utils/format'
import { bleCacheService } from './ble-cache-service'
import { cardService } from './card-service'
import { PhoneChangeService } from './types'

// 번호 변경 확인 알림에 담기는 데이터 (show-phone-change-confirm-notification에서 생성)
const parseNotificationData = (data: unknown) => {
  if (!data || typeof data !== 'object') return null
  const { cardId, newPhone } = data as Record<string, unknown>
  if (typeof cardId !== 'string' || typeof newPhone !== 'string') return null
  return { cardId, phone: newPhone }
}

// 번호 변경 요청에 대한 응답 처리. 시스템 알림 / 앱 안 Alert 모두 여기를 거친다.
export const phoneChangeService: PhoneChangeService = {
  confirm: async (cardId, phone) => {
    const res = await cardService.updatePhone(cardId, extractNumber(phone))
    if (!res.status) return res

    // 직접 변경한 사용자에게는 한동안 다시 묻지 않는다
    bleCacheService.markAlertLastDeniedAt()
    bleCacheService.increasePhoneChangeCount()
    bleCacheService.deleteAlertPending(cardId)
    return res
  },
  reject: cardId => {
    bleCacheService.markAlertLastDeniedAt()
    bleCacheService.deleteAlertPending(cardId)
  },
  // 알림 본문 탭은 앱을 여는 동작이므로 응답으로 보지 않는다.
  // 대기 목록이 남아 있어 앱이 열리면 화면 안에서 다시 묻는다.
  handleNotificationEvent: async ({ type, detail }) => {
    if (type !== EventType.ACTION_PRESS && type !== EventType.PRESS) return null

    const data = parseNotificationData(detail.notification?.data)
    if (!data) return null

    switch (detail.pressAction?.id) {
      case PHONE_CHANGE_ACTION.CONFIRM: {
        const res = await phoneChangeService.confirm(data.cardId, data.phone)
        if (!res.status) return { type: 'failed', message: res.message }
        return { type: 'confirmed', cardId: data.cardId, phone: data.phone }
      }
      case PHONE_CHANGE_ACTION.CANCEL:
        phoneChangeService.reject(data.cardId)
        return { type: 'rejected', cardId: data.cardId }
      default:
        return null
    }
  },
}
