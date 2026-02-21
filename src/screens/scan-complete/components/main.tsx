import { useScanCompleteContext } from '@/contexts/scan-complete-context';
import React from 'react';
import { View } from 'react-native';
import { Step1 } from './step1';
import { Step2 } from './step2';

type MainProps = {
  deviceId: string;
};

export const Main = ({ deviceId }: MainProps) => {
  const {
    state: { currentStep },
  } = useScanCompleteContext();
  return (
    <View>
      {currentStep === 0 && <Step1 />}
      {currentStep === 1 && <Step2 deviceId={deviceId}/>}
    </View>
  );
};
