import { useBleContext } from '@/contexts';
import { useEffect } from 'react';

export const useProfileViewModel = () => {
  const { actions } = useBleContext();

  useEffect(() => {
    actions.stopBackgroundScan();
    actions.stopBleScan();
  }, [actions]);
};
