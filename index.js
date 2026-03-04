/**
 * @format
 */

import { AppRegistry } from 'react-native';
import notifee, { EventType } from '@notifee/react-native';
import App from './App';
import { name as appName } from './app.json';
import { bleCacheService, cardService } from '@/services';
import { extractNumber } from '@/utils';

notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type !== EventType.ACTION_PRESS && type !== EventType.PRESS) return;

  const actionId = detail.pressAction?.id;
  const { newPhone, cardId } = detail.notification?.data || {};

  if (actionId === 'confirm' && cardId && newPhone) {
    await cardService.updatePhone(cardId, extractNumber(newPhone));
  } else {
    bleCacheService.markAlertLastDeniedAt();
  }
  bleCacheService.deleteAlertPending(cardId);
});

AppRegistry.registerComponent(appName, () => App);

// ✅ 여기는 백그라운드. REST 권장(또는 SDK가 확실히 초기화되어 있어야 함)

// const res = await fetch(
//   `https://parke-42fac-default-rtdb.firebaseio.com/devices/${deviceId}.json`,
//   {
//     method: 'PATCH',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       phone: newPhone,
//       updatedAt: Date.now(),
//     }),
//   },
// );
