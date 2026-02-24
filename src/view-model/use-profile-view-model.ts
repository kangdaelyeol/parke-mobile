import { useEffect } from 'react';
import { useBleContext } from '@/contexts';

export const useProfileViewModel = () => {
  const { actions } = useBleContext();

  useEffect(() => {
    actions.stopBleScan();
  }, []);
};
