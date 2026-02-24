import { useEffect } from 'react';
import { useBleContext } from '@/contexts';

export const useSettingViewModel = () => {
  const { actions } = useBleContext();
  useEffect(() => {
    actions.stopBleScan();
  }, []);
};
