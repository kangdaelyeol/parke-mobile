import { useBleContext, useUserContext } from '@/contexts';
import ensurePermissions from '@/helpers/ensure-permissions';
import { settingService } from '@/services';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

export const useHomeViewModel = () => {
  const {
    actions: { stopBleScan, startBackgroundScan },
    state: bleState,
  } = useBleContext();
  const { cards, user, syncCardList } = useUserContext();
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!user?.id) return;
      if (!bleState.bleManager) return;
      (async () => {
        setLoading(true);
        await syncCardList();
        setLoading(false);
      })();
    }, [bleState.bleManager, syncCardList, user?.id]),
  );

  useFocusEffect(
    useCallback(() => {
      if (!user?.id) return;
      if (!bleState.bleManager) return;
      const nowSession = bleState.scanSessionRef.current + 1;

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

        sub = bleState.bleManager?.onStateChange(state => {
          console.log(state);
          if (state === 'PoweredOn') {
            startBackgroundScan();
            sub?.remove();
          }
        }, true);
      })();

      return () => {
        stopBleScan(nowSession);
      };
    }, [
      cards.length,
      bleState.bleManager,
      startBackgroundScan,
      stopBleScan,
      bleState.scanSessionRef,
      user.id,
    ]),
  );

  return { state: { loading } };
};
