import { useBleContext, useUserContext } from '@/contexts';
import { settingService } from '@/services';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

export const useHomeViewModel = () => {
  const {
    actions: { stopBleScan, startBackgroundScan },
  } = useBleContext();
  const { cards, user, syncCardList } = useUserContext();
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!user?.id) return;
      (async () => {
        const settings = settingService.getSettings();

        if (!settings.active) return;
        if (cards.length === 0) return;
        startBackgroundScan();
      })();

      (async () => {
        setLoading(true);
        await syncCardList();
        setLoading(false);
      })();
      console.log(user.id, cards.length);

      return () => {
        stopBleScan();
      };
    }, [user.id, cards.length, syncCardList, startBackgroundScan, stopBleScan]),
  );

  return { state: { loading } };
};
