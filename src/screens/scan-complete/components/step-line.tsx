import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface StepBarProps {
  step: number;
  currentStep: number;
}

export const StepLine = ({ step, currentStep }: StepBarProps) => {
  const blueLineWidth = useSharedValue(0);

  if (currentStep > step) {
    blueLineWidth.value = withTiming(130, {
      duration: 300,
      easing: Easing.bezier(0.33, 1, 0.68, 1),
    });
  } else {
    blueLineWidth.value = withTiming(0, {
      duration: 300,
      easing: Easing.bezier(0.33, 1, 0.68, 1),
    });
  }

  const BlueLineAnimatedStyle = useAnimatedStyle(() => ({
    width: blueLineWidth.value,
  }));
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.blueLine, BlueLineAnimatedStyle]} />
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
  blueLine: {
    height: '100%',
    backgroundColor: '#396cf8',
  },
});
