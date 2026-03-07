import { StyleSheet, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { useScanCompleteStepLineViewModel } from '@/view-model'
import { StepLineProps } from '@scan-complete/types'

export const StepLine = ({ step }: StepLineProps) => {
  const { animated } = useScanCompleteStepLineViewModel({ step })

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.activeLine, animated.lineStyle]} />
    </View>
  )
}

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
})
