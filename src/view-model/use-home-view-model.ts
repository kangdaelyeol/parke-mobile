import { useEffect } from 'react';
import { useBleContext, useUserContext } from '@/contexts';
import { settingService } from '@/services';

export const useHomeViewModel = () => {
  const { actions } = useBleContext();
  const { cards } = useUserContext();
  useEffect(() => {
    (async () => {
      const settings = settingService.getSettings();

      if (!settings.active) return;
      if (cards.length === 0) return;

        actions.startBackgroundScan();
      })();

};
