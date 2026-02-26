import notifee from '@notifee/react-native';
import { convertPhone } from './convertPhone';
export async function nofifyMessage(phone: string) {
  await notifee.displayNotification({
    title: '전화번호가 변경되었음',
    body: `번호가 ${convertPhone(phone)}으로 변경됨.`,
  });
}
