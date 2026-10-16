import { Alert } from 'react-native'
import { formatPhone } from '@/utils/format'

interface PhoneChangeConfirmAlertHandlers {
  onConfirm: () => void
  onReject: () => void
}

// 번호를 바꿀지 묻는 앱 안 Alert
export const showPhoneChangeConfirmAlert = (
  cardName: string,
  phone: string,
  { onConfirm, onReject }: PhoneChangeConfirmAlertHandlers,
) => {
  Alert.alert(
    '전화번호 변경',
    `${cardName}에 저장된 번호를 ${formatPhone(phone)}으로 변경할까요?`,
    [
      { text: '취소', style: 'cancel', onPress: onReject },
      { text: '변경', onPress: onConfirm },
    ],
  )
}
