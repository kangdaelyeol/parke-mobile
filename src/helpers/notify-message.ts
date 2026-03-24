import notifee from '@notifee/react-native'
import { formatPhone } from '@/utils'
export const nofifyMessage = async (phone: string) => {
  await notifee.displayNotification({
    title: '전화번호가 변경되었음',
    body: `번호가 ${formatPhone(phone)}으로 변경됨.`,
  })
}
