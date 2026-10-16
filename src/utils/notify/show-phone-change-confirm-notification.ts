import notifee from '@notifee/react-native'
import {
  NOTIFICATION_CHANNEL_ID,
  PHONE_CHANGE_ACTION,
  PHONE_CHANGE_CATEGORY_ID,
} from '@/constants'
import { formatPhone } from '@/utils/format'

// 번호를 바꿀지 묻는 시스템 알림. 응답은 phoneChangeService.handleNotificationEvent에서 처리한다.
export const showPhoneChangeConfirmNotification = (
  oldPhone: string,
  newPhone: string,
  cardId: string,
) => {
  notifee.displayNotification({
    title: '전화번호 변경 확인',
    body: `등록된 번호 ${formatPhone(oldPhone)}을(를) ${formatPhone(
      newPhone,
    )}으로 변경하시겠습니까?\n번호를 변경하려면 길게 눌러서 확인해주세요.`,
    data: { newPhone, cardId },
    ios: {
      categoryId: PHONE_CHANGE_CATEGORY_ID,
    },
    android: {
      channelId: NOTIFICATION_CHANNEL_ID,
      pressAction: { id: 'default', launchActivity: 'default' },
      actions: [
        { title: '변경', pressAction: { id: PHONE_CHANGE_ACTION.CONFIRM } },
        { title: '취소', pressAction: { id: PHONE_CHANGE_ACTION.CANCEL } },
      ],
    },
  })
}
