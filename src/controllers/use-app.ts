import notifee, { EventType } from '@notifee/react-native';
import { useEffect } from 'react';
import { cache } from '../storage';
import { notifyOnScreenToChangePhone } from '../utils/notify-on-screen-to-change-phone';
import { Alert, AppState } from 'react-native';
import { setupNotifications } from '../helpers';
import { deviceService } from '../services';


const useForegroundEvent = () => {
  const { updatePhoneNumber } = deviceService;
  useEffect(() => {
    setupNotifications();

    const unsub = notifee.onForegroundEvent(async ({ type, detail }) => {
      if (type !== EventType.ACTION_PRESS && type !== EventType.PRESS) return;

      const actionId = detail.pressAction?.id;
      const { deviceId, newPhone, serial } = detail.notification?.data || {};

      if (actionId === 'confirm' && deviceId && newPhone) {
        try {
          await updatePhoneNumber(
            String(serial),
            String(deviceId),
            String(newPhone),
          );
          cache.clearPending();
        } catch (e) {
          Alert.alert('오류', '전화번호 변경에 실패했습니다.');
        }
      } else {
        cache.markLastDenied();
        cache.clearPending();
      }
    });

    return () => unsub();
  }, [updatePhoneNumber]);

  // 알림창을 통해 앱에 들어가는 경우 -> Alert를 통해 변경 여부 묻기
  useEffect(() => {
    const sub = AppState.addEventListener('change', async state => {
      if (state !== 'active') return;

      const pending = cache.getPending();
      if (!pending) return;

      notifyOnScreenToChangePhone(pending.phoneNumber);
      cache.clearPending();
    });

    return () => sub.remove();
  }, []);
};

export const useApp = () => {
  useForegroundEvent();
};
