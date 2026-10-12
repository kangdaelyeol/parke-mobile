import { Pressable, StyleSheet, Text, View } from 'react-native'
import { CARD_SCALE_MAX, CARD_SCALE_MIN } from '@/domain/card'
import { HomeScaleStepperProps } from '@home/types'
import { DM_MONO, PRETENDARD } from '@/theme/fonts'
import { DARK, DARK_LIGHT, GRAY, GRAY_DEEP, WHITE } from '@/theme/color'

const SCALE_STEP = 0.05

export const ScaleStepper = ({ value, onChange }: HomeScaleStepperProps) => {
  const canDecrease = value > CARD_SCALE_MIN
  const canIncrease = value < CARD_SCALE_MAX

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        크기 배율 ({CARD_SCALE_MIN} ~ {CARD_SCALE_MAX})
      </Text>
      <View style={styles.stepper}>
        <Pressable
          disabled={!canDecrease}
          onPress={() => onChange(value - SCALE_STEP)}
        >
          {({ pressed }) => (
            <View style={[styles.btn, pressed && styles.btnPressed]}>
              <Text
                style={[styles.btnText, !canDecrease && styles.btnTextDisabled]}
              >
                −
              </Text>
            </View>
          )}
        </Pressable>
        <Text style={styles.value}>{value.toFixed(2)}x</Text>
        <Pressable
          disabled={!canIncrease}
          onPress={() => onChange(value + SCALE_STEP)}
        >
          {({ pressed }) => (
            <View style={[styles.btn, pressed && styles.btnPressed]}>
              <Text
                style={[styles.btnText, !canIncrease && styles.btnTextDisabled]}
              >
                +
              </Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  title: {
    color: GRAY,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 13,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 55,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DARK_LIGHT,
    backgroundColor: DARK,
    paddingHorizontal: 8,
  },
  btn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: DARK_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: {
    borderColor: GRAY,
  },
  btnText: {
    color: WHITE,
    fontFamily: DM_MONO.MEDIUM,
    fontSize: 20,
  },
  btnTextDisabled: {
    color: GRAY_DEEP,
  },
  value: {
    color: WHITE,
    fontFamily: DM_MONO.MEDIUM,
    fontSize: 17,
  },
})
