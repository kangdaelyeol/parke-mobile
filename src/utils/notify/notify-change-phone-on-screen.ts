import { Alert } from 'react-native'
import { bleCacheService, cardService } from '@/services'
import { formatPhone } from '@/utils'

export const notifyChangePhoneOnScreen = (
  cardName: string,
  cardId: string,
  phone: string,
  onCardPhoneChange: (cardId: string, phone: string) => void,
) => {
  Alert.alert(
    '전화번호 변경',
    `${cardName}에 저장된 번호를 ${formatPhone(phone)}으로 변경할까요?`,
    [
      {
        text: '취소',
        style: 'cancel',
        onPress: () => {
          bleCacheService.clearAlertPending()
          bleCacheService.markAlertLastDeniedAt()
        },
      },
      {
        text: '변경',
        onPress: async () => {
          const res = await cardService.updatePhone(cardId, phone)
          if (!res.status) {
            return Alert.alert(res.message)
          }
          onCardPhoneChange(cardId, phone)
          Alert.alert('전화번호가 변경되었습니다!')
          bleCacheService.increasePhoneChangeCount()
          bleCacheService.clearAlertPending()
          bleCacheService.clearAlertLastDeniedAt()
        },
      },
    ],
  )
}
