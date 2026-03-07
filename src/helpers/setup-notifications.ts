import notifee, { AndroidImportance } from '@notifee/react-native';

// 앱 시작 시 1회 실행 (index.ts 등)
export const setupNotifications = async () => {
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
