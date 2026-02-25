import { useBleContext, useUserContext } from '@/contexts';
import { startBackgroundScan } from '@/helpers';
import ensurePermissions from '@/helpers/ensure-permissions';
import { settingService } from '@/services';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';

export const useHomeViewModel = () => {
  const {
    actions: { stopBleScan },
    state: bleState,
  } = useBleContext();
  const { cards, user, syncCardList, setCards } = useUserContext();
  const { bleManager, scanSessionRef, bgScanRef } = bleState;
  const [loading, setLoading] = useState(false);

  const cardsRef = useRef(cards);
  const userRef = useRef(user);

  useEffect(() => {
    cardsRef.current = cards;
  }, [cards]);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const startBackgroundScanMemorized = useCallback(async () => {
    if (!bleManager) return;

    await startBackgroundScan({
      scanSessionRef,
      bleManager,
      bgScanRef,
      cardsRef,
      setCards,
      userRef,
    });
  }, [scanSessionRef, bleManager, bgScanRef, userRef, cardsRef, setCards]);

  useFocusEffect(
    useCallback(() => {
      if (!user?.id) return;
      if (!bleManager) return;
      (async () => {
        setLoading(true);
        await syncCardList();
        setLoading(false);
      })();
    }, [bleManager, syncCardList, user?.id]),
  );

  useFocusEffect(
    useCallback(() => {
      if (!user?.id) return;
      if (!bleManager) return;
      if (!startBackgroundScanMemorized) return;
      const nowSession = scanSessionRef.current + 1;

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

        sub = bleManager?.onStateChange(state => {
          console.log(state);
          if (state === 'PoweredOn') {
            startBackgroundScanMemorized();
            sub?.remove();
          }
        }, true);
      })();

      return () => {
        stopBleScan(nowSession);
      };
    }, [
      cards.length,
      bleManager,
      startBackgroundScanMemorized,
      stopBleScan,
      scanSessionRef,
      user.id,
    ]),
  );

  return { state: { loading } };
};
