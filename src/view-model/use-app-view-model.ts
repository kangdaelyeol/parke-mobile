import { useEffect } from 'react';
import { Alert, AppState } from 'react-native';
import notifee, { EventType } from '@notifee/react-native';
import { cache } from '@/storage';
import { setupNotifications } from '@/helpers';
import { cardService } from '@/services';
import { notifyChangePhoneOnScreen } from '@/utils';
import { useUserContext } from '@/contexts';
export const useAppViewModel = () => {
  const { setCards } = useUserContext();
  
  useEffect(() => {
    setupNotifications();

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
      cache.markLastDenied();
      cache.clearPending();
    });

    return () => unsub();
  }, []);

  // 알림창을 통해 앱에 들어가는 경우 -> Alert를 통해 변경 여부 묻기
  useEffect(() => {
    const sub = AppState.addEventListener('change', async state => {
      if (state !== 'active') return;

      const pending = cache.getPending();
      if (!pending) return;

      notifyChangePhoneOnScreen(pending.cardId, pending.phone, setCards);
      cache.clearPending();
    });

    return () => sub.remove();
  }, [setCards]);
};
