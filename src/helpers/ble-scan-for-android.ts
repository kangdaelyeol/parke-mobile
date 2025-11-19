// startBleForeground.ts (안드로이드 전용)
import notifee, { AndroidImportance } from '@notifee/react-native';
import { Platform } from 'react-native';
import { safeStartScan, stopBackgroundScan } from '../background/manager';

export async function startBleForeground() {
  if (Platform.OS !== 'android') return;

  const channelId = await notifee.createChannel({
    id: 'ble-scan',
    name: 'BLE Scanning',
    importance: AndroidImportance.LOW,
  });

  await notifee.displayNotification({
    title: 'Scanning nearby devices',
    body: 'BLE scanning is running',
    android: {
      channelId,
      asForegroundService: true,
      ongoing: true,
      // smallIcon: 'ic_stat_name', // 프로젝트에 맞게
      // color: AndroidColor.BLUE,
    },
  });

  notifee.registerForegroundService(async _ => {
    try {
      await safeStartScan();
      // 필요하다면 여기서 주기적으로 health-check 수행
    } catch (e) {
      console.warn('FG service error', e);
    }
  });
}

export async function stopBleForeground() {
  stopBackgroundScan();
  await notifee.cancelAllNotifications();
}
