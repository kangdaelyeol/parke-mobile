/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import notifee, { EventType } from '@notifee/react-native';
import { deviceService } from './src/services';

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { updatePhoneNumber } = deviceService;
  if (type !== EventType.ACTION_PRESS && type !== EventType.PRESS) return;

  const actionId = detail.pressAction?.id;
  const { deviceId, newPhone } = detail.notification?.data || {};

  if (actionId === 'confirm' && deviceId && newPhone) {
    try {
      updatePhoneNumber(deviceId, newPhone);
    } catch (e) {
      // bground에서는 Alert 안터짐
    }
  }
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
