import { Alert } from 'react-native'
import { bleCacheService, cardService } from '@/services'
import { CardDto } from '@/domain/card'
import { convertPhone } from '@/helpers'

export const notifyChangePhoneOnScreen = (
  cardName: string,
  cardId: string,
  phone: string,
  setCards: React.Dispatch<React.SetStateAction<CardDto[]>>,
) => {
  Alert.alert(
    '전화번호 변경',
    `${cardName}에 저장된 번호를 ${convertPhone(phone)}으로 변경할까요?`,
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
          if (!res) {
            return Alert.alert(
              '네트워크 오류',
              '오류가 발생했습니다. 잠시후 다시 시도해주세요.',
            )
          }
          setCards(prev => {
            const newCards = [...prev]
            const index = newCards.findIndex(c => c.id === cardId)
            if (index === -1) return prev
            newCards[index].phone = phone
            return newCards
          })
          Alert.alert('전화번호가 변경되었습니다!')
          bleCacheService.increasePhoneChangeCount()
          bleCacheService.clearAlertPending()
          bleCacheService.clearAlertLastDeniedAt()
        },
      },
    ],
  )
}
