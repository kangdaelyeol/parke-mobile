import { Pressable, StyleSheet, Text, View } from 'react-native'
import { CARD_SCALE_MAX, CARD_SCALE_MIN } from '@/domain/card'
import { HomeScaleStepperProps } from '@home/types'
import { DM_MONO, PRETENDARD } from '@/theme/fonts'
import { GLASS, glassStyles, glassText, TEXT } from '@/theme/glass'
import { useThemedSheet } from '@/theme/themed'
import { DARK, DARK_LIGHT, GRAY, GRAY_DEEP, WHITE } from '@/theme/color'

const SCALE_STEP = 0.05

export const ScaleStepper = ({ value, onChange }: HomeScaleStepperProps) => {
  const styles = useThemedSheet<typeof glass>({
    classic,
    'glass-dashboard': glass,
  })
  const canDecrease = value > CARD_SCALE_MIN
  const canIncrease = value < CARD_SCALE_MAX

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        크기 배율 ({CARD_SCALE_MIN} ~ {CARD_SCALE_MAX})
      </Text>
      <View style={[styles.stepperBox, styles.stepper]}>
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

// 글래스
const glass = StyleSheet.create({
  stepperBox: glassStyles.field,
  container: {
    gap: 10,
  },
  title: glassText.label,
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 55,
    paddingHorizontal: 7,
  },
  // 판 안의 작은 유리 버튼
  btn: {
    width: 40,
    height: 40,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: GLASS.border,
    borderTopColor: GLASS.highlight,
    backgroundColor: GLASS.fill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: {
    backgroundColor: GLASS.fillActive,
    borderColor: GLASS.borderActive,
  },
  btnText: {
    color: TEXT.primary,
    fontFamily: DM_MONO.MEDIUM,
    fontSize: 20,
  },
  btnTextDisabled: {
    color: TEXT.faint,
  },
  value: {
    color: TEXT.primary,
    fontFamily: DM_MONO.MEDIUM,
    fontSize: 17,
  },
})

// 기본 테마 (처음 디자인)
const classic = StyleSheet.create({
  container: { gap: 10 },
  title: { color: GRAY, fontFamily: PRETENDARD.BOLD, fontSize: 13 },
  stepperBox: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DARK_LIGHT,
    backgroundColor: DARK,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 55,
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
  btnPressed: { borderColor: GRAY },
  btnText: { color: WHITE, fontFamily: DM_MONO.MEDIUM, fontSize: 20 },
  btnTextDisabled: { color: GRAY_DEEP },
  value: { color: WHITE, fontFamily: DM_MONO.MEDIUM, fontSize: 17 },
})
