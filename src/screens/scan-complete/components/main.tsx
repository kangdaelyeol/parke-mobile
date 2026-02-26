import React from 'react';
import { View } from 'react-native';
import { Step1, Step2 } from '@scan-complete/components';
import { useScanCompleteViewModel } from '@/view-model';

type MainProps = {
  deviceId: string;
};

export const Main = ({ deviceId }: MainProps) => {
  const {
    state: { currentStep },
  } = useScanCompleteViewModel({ deviceId });
  return (
    <View>
      {currentStep === 0 && <Step1 />}
      {currentStep === 1 && <Step2 />}
    </View>
  );
};
