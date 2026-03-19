import { useEffect } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { GRAY_DEEP, GRAY_LIGHT, WHITE } from '@/theme/color'
import { DM_SANS } from '@/theme/fonts'
import { CheckIllustration } from './illustrations'

interface Props {
  confirm: boolean
  confirmPress: () => void
  label: string
  top?: boolean
  required?: boolean
  docs?: string
}

export const CheckBoxLine = ({
  confirm,
  confirmPress,
  top,
  required,
  docs,
  label,
}: Props) => {
  const progress = useSharedValue(0)

  const checkIconStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }))

  const checkBoxStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ['#000000', '#5555ff'],
    ),
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [GRAY_DEEP, '#5555ff'],
    ),
  }))

  useEffect(() => {
    if (confirm === true)
      progress.value = withTiming(1, {
        duration: 130,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
      })
    else
      progress.value = withTiming(0, {
        duration: 130,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
      })
  }, [confirm, progress])

  return (
    <View style={styles.container}>
      <Pressable style={styles.row} onPress={confirmPress}>
        <Animated.View style={[styles.checkbox, checkBoxStyle]}>
          <Animated.View style={checkIconStyle}>
            <CheckIllustration size={12} />
          </Animated.View>
        </Animated.View>
        {required && (
          <View style={styles.requiredBox}>
            <Text style={styles.requiredText}>필수</Text>
          </View>
        )}
        <Text style={[styles.label, top && styles.topLabel]}>{label}</Text>
      </Pressable>
      {docs && <Text style={styles.docsBtn}>보기</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 3,
  },
  label: {
    fontFamily: DM_SANS.MEDIUM,
    fontSize: 15,
    color: GRAY_LIGHT,
  },
  topLabel: {
    fontSize: 17,
    color: WHITE,
  },
  requiredBox: {
    fontFamily: DM_SANS.MEDIUM,
    paddingHorizontal: 7,
    paddingVertical: 3,
    backgroundColor: '#5050ff26',
    borderRadius: 3,
  },
  requiredText: {
    color: '#7777ff',
    fontSize: 12,
  },
  docsBtn: {
    color: GRAY_DEEP,
    fontFamily: DM_SANS.BOLD,
    fontSize: 14,
  },
})
