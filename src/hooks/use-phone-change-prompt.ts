import { useCallback } from 'react'
import { Alert } from 'react-native'
import { PhoneChangePending } from '@/client'
import { useUserContext } from '@/contexts'
import { phoneChangeService } from '@/services'
import { showPhoneChangeConfirmAlert } from '@/utils'

// 지금 Alert가 떠 있는 카드. 홈 스캔과 앱 복귀 처리가 함께 쓰도록 모듈 단위로 둔다.
const openCardIds = new Set<string>()

// 대기 중인 번호 변경 요청을 앱 안 Alert로 묻는다.
// 같은 카드의 Alert가 이미 떠 있으면 다시 띄우지 않는다.
export const usePhoneChangePrompt = () => {
  const { actions: userContextActions } = useUserContext()

  return useCallback(
    ({ cardId, cardName, phone }: PhoneChangePending) => {
      if (openCardIds.has(cardId)) return
      openCardIds.add(cardId)

      showPhoneChangeConfirmAlert(cardName, phone, {
        onConfirm: async () => {
          openCardIds.delete(cardId)
          const res = await phoneChangeService.confirm(cardId, phone)
          if (!res.status) return Alert.alert(res.message)
          userContextActions.updateCardPhone(cardId, phone)
          Alert.alert('전화번호가 변경되었습니다!')
        },
        onReject: () => {
          openCardIds.delete(cardId)
          phoneChangeService.reject(cardId)
        },
      })
    },
    [userContextActions],
  )
}
