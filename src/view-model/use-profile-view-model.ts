import { useEffect } from 'react';
import { useBleContext } from '@/contexts';

export const useProfileViewModel = () => {
  const {
    actions: { stopBleScan },
  } = useBleContext();

  useEffect(() => {
    stopBleScan();
  }, [stopBleScan]);
};
