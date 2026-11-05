import { StyleSheet, Pressable, View } from 'react-native'
import { GLASS } from '@/theme/glass'
import { useThemeId } from '@/theme/themed'
import Animated from 'react-native-reanimated'
import { useToggleViewModel } from './use-toggle-view-model'
import { ToggleProps } from './types'

// 켜고 끄는 스위치. 기본 테마: 파란 바탕 / 글래스: 초록 유리
export const Toggle = ({ value, disabled, onValueChange }: ToggleProps) => {
  const { actions, animated } = useToggleViewModel({
    value,
    disabled,
    onValueChange,
  })
  const isGlass = useThemeId() === 'glass-dashboard'

  return (
    <Pressable onPress={actions.handleTogglePress}>
      <Animated.View
        style={[
          isGlass ? styles.container : classic.container,
          animated.backgroundStyle,
          isGlass && disabled && styles.disabled,
        ]}
      >
        {/* 기본 테마는 끌 수 없을 때 어둡게 덮는다 */}
        {!isGlass && disabled && <View style={classic.disabledContainer} />}
        <Animated.View
          style={[isGlass ? styles.dot : classic.dot, animated.dotStyle]}
        />
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

// 기본 테마 (처음 디자인)
const classic = StyleSheet.create({
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
  disabledContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 3333,
    zIndex: 1,
    backgroundColor: '#000000af',
  },
})
