import { Pressable, StyleSheet, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { useToggleViewModel } from './use-toggle-view-model'
import { ToggleProps } from './types'

// 켜고 끄는 스위치 (기본 테마: 파란 바탕, 처음 디자인). 끌 수 없으면 어둡게 덮는다
export const ClassicToggle = ({
  value,
  disabled,
  onValueChange,
}: ToggleProps) => {
  const { actions, animated } = useToggleViewModel({
    value,
    disabled,
    onValueChange,
  })

  return (
    <Pressable onPress={actions.handleTogglePress}>
      <Animated.View style={[styles.container, animated.backgroundStyle]}>
        {disabled && <View style={styles.disabledCover} />}
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
  disabledCover: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 3333,
    zIndex: 1,
    backgroundColor: '#000000af',
  },
})
