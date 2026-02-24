import { useBleContext, useUserContext } from '@/contexts';
import { settingService } from '@/services';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

export const useHomeViewModel = () => {
  const { actions } = useBleContext();
  const { cards, user, setCards, syncCardList } = useUserContext();
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      (async () => {
        const settings = settingService.getSettings();

        if (!settings.active) return;
        if (cards.length === 0) return;

        actions.startBackgroundScan();
      })();

      (async () => {
        setLoading(true);
        await syncCardList();
        setLoading(false);
      })();

      return () => {
        actions.stopBleScan();
      };
    }, [user, cards.length, syncCardList]),
  );

  return { state: { loading } };
};
