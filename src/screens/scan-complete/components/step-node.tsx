import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { FONT } from '@/theme/fonts';

interface StepProps {
  label: string;
  currentStep: number;
  step: number;
}

export const StepNode = ({ label, step, currentStep }: StepProps) => {
  const dotBackgroundColor = useSharedValue('#000000');
  const dotScale = useSharedValue(0);
  const checkIconOpacity = useSharedValue(0);

  useEffect(() => {
    if (step === currentStep) {
      dotBackgroundColor.value = '#396cf8';
      dotScale.value = withTiming(1, {
        duration: 300,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
      });
      checkIconOpacity.value = withDelay(
        500,
        withTiming(0, {
          duration: 200,
          easing: Easing.bezier(0.33, 1, 0.68, 1),
        }),
      );
    }

    if (step < currentStep) {
      dotBackgroundColor.value = '#396cf8';
      dotScale.value = withTiming(2, {
        duration: 300,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
      });
      checkIconOpacity.value = withDelay(
        300,
        withTiming(1, { duration: 200, easing: Easing.linear }),
      );
    }

    if (step > currentStep) {
      dotBackgroundColor.value = '#000000';
      dotScale.value = withTiming(0, {
        duration: 300,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
      });
      checkIconOpacity.value = withDelay(
        500,
        withTiming(0, {
          duration: 200,
          easing: Easing.bezier(0.33, 1, 0.68, 1),
        }),
      );
    }
  }, [checkIconOpacity, currentStep, dotBackgroundColor, dotScale, step]);

  const dotAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }],
    backgroundColor: dotBackgroundColor.value,
  }));

  const checkIconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: checkIconOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <View style={[styles.dotBox]}>
        <Animated.View style={[styles.dot, dotAnimatedStyle]}>
          <Animated.View style={checkIconAnimatedStyle}>
            {step < currentStep && (
              <FontAwesome6
                iconStyle="solid"
                name="check"
                color={'#eeeeee'}
                size={10}
              />
            )}
          </Animated.View>
        </Animated.View>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    zIndex: 1,
  },
  dotBox: {
    width: 35,
    height: 35,
    borderWidth: 2,
    borderColor: '#396cf8',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#396cf8',
  },
  label: {
    marginTop: 10,
    color: '#eeeeee',
    fontFamily: FONT.REGULAR,
  },
});
