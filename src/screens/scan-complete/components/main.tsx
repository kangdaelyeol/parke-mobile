import { useScanCompleteContext } from '@/contexts/scan-complete-context';
import React from 'react';
import { View } from 'react-native';
import { Step1 } from './step1';
import { Step2 } from './step2';

export const Main = () => {
  const {
    state: { currentStep },
  } = useScanCompleteContext();
  return (
    <View>
      {currentStep === 0 && <Step1 />}
      {currentStep === 1 && <Step2 />}
    </View>
  );
};
