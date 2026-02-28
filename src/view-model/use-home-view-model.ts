import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useBleContext, useUserContext } from '@/contexts';
import { startBackgroundScan, ensurePermissions } from '@/helpers';
import { settingService } from '@/services';

export const useHomeViewModel = () => {
  const {
    actions: { stopBleScan },
    state: bleState,
  } = useBleContext();
  const { bleManagerRef, scanSessionRef, bgScanRef } = bleState;
  const { cards, user, syncCardList, setCards } = useUserContext();
  const [loading, setLoading] = useState(false);

  const cardsRef = useRef(cards);
  const userRef = useRef(user);

  useEffect(() => {
    cardsRef.current = cards;
  }, [cards]);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const startBackgroundScanMemorized = useCallback(async () => {
    if (!bleState.bleManagerIsReady) return;
    if (!bleManagerRef.current) return;

    await startBackgroundScan({
      scanSessionRef,
      bgScanRef,
      cardsRef,
      setCards,
      userRef,
      bleManagerRef,
    });
  }, [
    scanSessionRef,
    bleManagerRef,
    bgScanRef,
    userRef,
    cardsRef,
    setCards,
    bleState.bleManagerIsReady,
  ]);

  useFocusEffect(
    useCallback(() => {
      if (!bleState.bleManagerIsReady) return;
      if (!user?.id) return;
      if (!bleManagerRef) return;
      (async () => {
        setLoading(true);
        await syncCardList();
        setLoading(false);
      })();
    }, [bleManagerRef, syncCardList, user?.id, bleState.bleManagerIsReady]),
  );

  useFocusEffect(
    useCallback(() => {
      if (!bleState.bleManagerIsReady) return;
      if (!user?.id) return;
      if (!bleManagerRef) return;
      if (!startBackgroundScanMemorized) return;
      if (user.phone.trim() === '') {
        Alert.alert(
          '전화번호 등록 필요',
          '백그라운드 장치 스캔을 위해서는 전화번호 등록이 필요합니다.',
        );
        return;
      }

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

        sub = bleManagerRef.current?.onStateChange(state => {
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
      user.id,
      user.phone,
      bleManagerRef,
      startBackgroundScanMemorized,
      scanSessionRef,
      cards.length,
      stopBleScan,
      bleState.bleManagerIsReady,
    ]),
  );

  return { state: { loading } };
};
