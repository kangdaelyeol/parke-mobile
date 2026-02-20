import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StepNode } from './step-node';
import { StepLine } from './step-line';
import { useScanCompleteContext } from '@/contexts/scan-complete-context';

const stepConfig = [{ label: '기본정보 등록' }, { label: '기기정보 등록' }];

export const ProgressStepper = () => {
  const {
    state: { currentStep },
  } = useScanCompleteContext();
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        {stepConfig.map((v, i) => {
          return (
            <View key={v.label} style={styles.step}>
              <StepNode label={v.label} step={i} currentStep={currentStep} />
              {i < stepConfig.length - 1 && (
                <StepLine step={i} currentStep={currentStep} />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    marginTop: 20,
  },
  wrapper: {
    flexDirection: 'row',
    maxWidth: 300,
    marginHorizontal: 'auto',
    justifyContent: 'center',
  },
  step: {
    flexDirection: 'row',
  },
  stepDot: {
    width: 35,
    height: 35,
    borderWidth: 2,
    borderColor: '#396cf8',
    backgroundColor: '#000000',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  insideDot: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    backgroundColor: '#396cf8',
  },
  stepText: {
    marginTop: 10,
    color: '#eeeeee',
    fontWeight: '700',
  },
});
