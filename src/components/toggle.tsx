import { StyleSheet, View, Pressable } from 'react-native'
import Animated from 'react-native-reanimated'
import { useToggleViewModel } from '@/view-model/setting'
import { ToggleProps } from './types'



export const Toggle = ({ value, disabled, onValueChange }: ToggleProps) => {
  const { actions, animated } = useToggleViewModel({
    value,
    disabled,
    onValueChange,
  })

  return (
    <Pressable onPress={actions.handleTogglePress}>
      <Animated.View style={[styles.container, animated.backgroundStyle]}>
        {disabled && <View style={[disabled && styles.disabledContainer]} />}
        <Animated.View style={[styles.dot, animated.dotStyle]} />
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 58,
    height: 30,
    borderRadius: 3333,
    backgroundColor: '#3b3bf9',
    justifyContent: 'center',
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    backgroundColor: '#e5e5e5',
    left: 3,
    transform: [{ translateX: 27 }],
  },
  disabledContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 3333,
    zIndex: 1,
    backgroundColor: '#000000af',
  },
})
