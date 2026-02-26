import notifee, { AndroidImportance } from '@notifee/react-native';
import { convertPhone } from './convertPhone';

// 앱 시작 시 1회 실행 (index.ts 등)
export const setupNotifications = async () => {
  await notifee.requestPermission();
  await notifee.setNotificationCategories([
    {
      id: 'CONFIRM_PHONE',
      actions: [
        // iOS에서 백그라운드 처리하려면 foreground: false 권장
        { id: 'confirm', title: '변경', foreground: false },
        { id: 'cancel', title: '취소', destructive: true, foreground: false },
      ],
    },
  ]);

  // 안드 채널도 여기서 1회
  await notifee.createChannel({
    id: 'ble-device',
    name: 'BLE Device Notifications',
    importance: AndroidImportance.HIGH,
  });
};

// 알림 띄우기
export const notifyPhoneChange = (
  oldPhone: string,
  newPhone: string,
  cardId: string,
) => {
  notifee.displayNotification({
    title: '전화번호 변경 확인',
    body: `등록된 번호 ${convertPhone(oldPhone)}을(를) ${convertPhone(
      newPhone,
    )}으로 변경하시겠습니까?\n번호를 변경하려면 길게 눌러서 확인해주세요.`,
    data: { newPhone, cardId }, // 문자열이면 OK

    ios: {
      categoryId: 'CONFIRM_PHONE', // ✅ iOS 액션 표시 필수
    },
    android: {
      channelId: 'ble-device',
      pressAction: { id: 'default', launchActivity: 'default' },
      actions: [
        { title: '변경', pressAction: { id: 'confirm' } },
        { title: '취소', pressAction: { id: 'cancel' } },
      ],
    },
  });
};
