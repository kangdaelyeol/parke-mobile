import { useEffect } from 'react';
import { ScanCompleteViewModel } from '@scan-complete/types';
import { useScanCompleteContext } from '@/contexts';

interface ScanCompleteViewModelProps {
  deviceId: string;
}
export const useScanCompleteMainViewModel = ({
  deviceId,
}: ScanCompleteViewModelProps): ScanCompleteViewModel => {
  const { actions, state } = useScanCompleteContext();
  useEffect(() => {
    actions.setDeviceId(deviceId);
  }, [actions, deviceId]);
  return {
    state: { currentStep: state.currentStep },
    actions: {},
  };
};
