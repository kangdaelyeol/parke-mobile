import { useEffect } from 'react';
import { Alert, AppState } from 'react-native';
import notifee, { EventType } from '@notifee/react-native';
import { setupNotifications } from '@/helpers';
import { cardService, cacheService, bleCacheService } from '@/services';
import { notifyChangePhoneOnScreen } from '@/utils';
import { useUserContext } from '@/contexts';
export const useAppViewModel = () => {
  const { setCards } = useUserContext();

  useEffect(() => {
    setupNotifications();
    cacheService.ensureInitialized();

    const unsub = notifee.onForegroundEvent(async ({ type, detail }) => {
      if (type !== EventType.ACTION_PRESS && type !== EventType.PRESS) return;

      const actionId = detail.pressAction?.id;
      const { cardId, newPhone } = detail.notification?.data || {};

      if (actionId !== 'confirm' || !newPhone || !cardId) return;

      try {
        await cardService.updatePhone(String(cardId), String(newPhone));
      } catch (e) {
        Alert.alert('오류', '전화번호 변경에 실패했습니다.');
      }
      bleCacheService.markAlertLastDeniedAt();
      bleCacheService.clearAlertPending();
    });

    return () => unsub();
  }, []);

  // 알림창을 통해 앱에 들어가는 경우 -> Alert를 통해 변경 여부 묻기
  useEffect(() => {
    const sub = AppState.addEventListener('change', async state => {
      if (state !== 'active') return;

      const pendingList = bleCacheService.getAlertPendingList();
      pendingList.forEach(pending => {
        if (pending)
          notifyChangePhoneOnScreen(pending.cardName, pending.cardId, pending.phone, setCards);
      });

      bleCacheService.clearAlertPending();
    });

    return () => sub.remove();
  }, [setCards]);
};
