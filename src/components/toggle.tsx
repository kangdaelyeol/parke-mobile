import { StyleSheet, Pressable } from 'react-native'
import { GLASS } from '@/theme/glass'
import Animated from 'react-native-reanimated'
import { useToggleViewModel } from './use-toggle-view-model'
import { ToggleProps } from './types'

export const Toggle = ({ value, disabled, onValueChange }: ToggleProps) => {
  const { actions, animated } = useToggleViewModel({
    value,
    disabled,
    onValueChange,
  })

  return (
    <Pressable onPress={actions.handleTogglePress}>
      <Animated.View
        style={[
          styles.container,
          animated.backgroundStyle,
          disabled && styles.disabled,
        ]}
      >
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
    borderWidth: 1,
    borderTopColor: GLASS.highlight,
    experimental_backgroundImage:
      'linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 70%)',
    justifyContent: 'center',
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    backgroundColor: '#f2f2f2',
    left: 2,
    transform: [{ translateX: 27 }],
    boxShadow: '0px 2px 6px rgba(0,0,0,0.35)',
  },
  disabled: {
    opacity: 0.35,
  },
})
