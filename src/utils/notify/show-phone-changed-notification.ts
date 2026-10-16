import notifee from '@notifee/react-native'
import { NOTIFICATION_CHANNEL_ID } from '@/constants'
import { formatPhone } from '@/utils/format'

// 자동 변경이 끝났음을 알리는 시스템 알림
export const showPhoneChangedNotification = async (
  cardName: string,
  phone: string,
) => {
  await notifee.displayNotification({
    title: '전화번호 변경 완료',
    body: `${cardName}의 번호가 ${formatPhone(phone)}으로 변경되었습니다.`,
    android: { channelId: NOTIFICATION_CHANNEL_ID },
  })
}
