import { StyleSheet, Text, View } from 'react-native'
import Animated from 'react-native-reanimated'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import { DM_SANS } from '@/theme/fonts'
import { useScanCompleteStepNodeViewModel } from '@/view-model'
import { BLUE_PRIMARY, WHITE } from '@/theme/color'

interface StepProps {
  label: string
  step: number
}

export const StepNode = ({ label, step }: StepProps) => {
  const { animated, state } = useScanCompleteStepNodeViewModel({ step })
  return (
    <View style={styles.container}>
      <View style={[styles.dotBox]}>
        <Animated.View
          style={[
            styles.dot,
            animated.dotStyle,
            step > state.currentStep ? styles.inactiveDot : styles.activeDot,
          ]}
        >
          <Animated.View style={animated.checkIconStyle}>
            {step < state.currentStep && (
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
  )
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    zIndex: 1,
  },
  dotBox: {
    width: 35,
    height: 35,
    borderWidth: 2,
    borderColor: BLUE_PRIMARY,
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
  },
  inactiveDot: {
    backgroundColor: '#000000',
  },
  activeDot: {
    backgroundColor: BLUE_PRIMARY,
  },
  label: {
    marginTop: 10,
    color: WHITE,
    fontFamily: DM_SANS.BOLD,
  },
})
