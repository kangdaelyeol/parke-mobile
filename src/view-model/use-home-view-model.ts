import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useUserContext } from '@/contexts';
import { ensurePermissions } from '@/helpers';
import { bleService, settingService } from '@/services';

export const useHomeViewModel = () => {
  const { cards, user, syncCardList, setCards } = useUserContext();
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!user?.id) return;
      (async () => {
        setLoading(true);
        await syncCardList();
        setLoading(false);
      })();
    }, [syncCardList, user?.id]),
  );

  useFocusEffect(
    useCallback(() => {
      if (!user?.id) return;

      if (user.phone.trim() === '') {
        Alert.alert(
          '전화번호 등록 필요',
          '백그라운드 장치 스캔을 위해서는 전화번호 등록이 필요합니다.',
        );
        return;
      }

      const nowSession = bleService.getSession() + 1;

      let sub: { remove: () => void } | undefined;
      (async () => {
        const settings = settingService.getSettings();
        if (!settings.active) return;
        if (cards.length === 0) return;
        const ok = await ensurePermissions();
        if (!ok) {
          Alert.alert('권한 필요', 'BLE 권한을 허용해주세요');
          return;
        }

        sub = bleService.getManager().onStateChange(state => {
          if (state === 'PoweredOn') {
            bleService.startBackgroundScan({ setCards, cards, user });
            sub?.remove();
          }
        }, true);
      })();

      return () => {
        bleService.stopScan(nowSession);
      };
    }, [user, cards, setCards]),
  );

  return { state: { loading } };
};
