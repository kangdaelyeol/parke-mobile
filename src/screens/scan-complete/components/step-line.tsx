import { useScanCompleteContext } from '@/contexts';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface StepLineProps {
  step: number;
}

export const StepLine = ({ step }: StepLineProps) => {
  const {
    state: { currentStep },
  } = useScanCompleteContext();
  const activeLineWidth = useSharedValue(0);

  useEffect(() => {
    if (currentStep > step) {
      activeLineWidth.value = withTiming(1, {
        duration: 300,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
      });
    } else {
      activeLineWidth.value = withTiming(0, {
        duration: 300,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
      });
    }
  }, [step, currentStep, activeLineWidth]);

  const lineAnimatedStyle = useAnimatedStyle(() => ({
    width: activeLineWidth.value * 130,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.activeLine, lineAnimatedStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 3,
    top: 16,
    marginHorizontal: -22,
    width: 130,
    backgroundColor: '#363636',
  },
  activeLine: {
    height: '100%',
    backgroundColor: '#396cf8',
  },
});
