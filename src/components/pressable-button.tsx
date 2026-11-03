import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native'
import { DM_SANS } from '@/theme/fonts'
import { BLUE_PRIMARY, GRAY, RED_LIGHT, WHITE } from '@/theme/color'
import { GLASS } from '@/theme/glass'

// primary: 색이 채워진 유리 (기본 파랑, tint로 색 변경)
// secondary: 투명한 유리 (취소·완료 등)
// danger: 빨간 테두리 유리 (삭제·탈퇴)
export type ButtonVariant = 'primary' | 'secondary' | 'danger'

interface PressableButtonProps {
  onPress: () => void
  title: string
  variant?: ButtonVariant
  // primary 색 (#RRGGBB)
  tint?: string
  // 흐리게 표시하고 누를 수 없음
  disabled?: boolean
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  pressableStyle?: StyleProp<ViewStyle>
}

const withAlpha = (hex: string, alpha: number) => {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16))
  return `rgba(${r},${g},${b},${alpha})`
}

// 위쪽이 살짝 밝은 광택 (유리 표면에 빛이 닿는 느낌)
const SHEEN =
  'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 55%, rgba(255,255,255,0) 100%)'

const variantStyle = (
  variant: ButtonVariant,
  tint: string,
  pressed: boolean,
): ViewStyle => {
  if (variant === 'primary')
    return {
      backgroundColor: withAlpha(tint, pressed ? 0.95 : 0.82),
      borderColor: withAlpha(tint, 0.9),
      borderTopColor: 'rgba(255,255,255,0.35)',
      experimental_backgroundImage: SHEEN,
      boxShadow: `0px 6px 18px ${withAlpha(tint, pressed ? 0.2 : 0.35)}`,
    }
  if (variant === 'danger')
    return {
      backgroundColor: withAlpha(RED_LIGHT, pressed ? 0.16 : 0.08),
      borderColor: withAlpha(RED_LIGHT, pressed ? 0.6 : 0.35),
      borderTopColor: withAlpha(RED_LIGHT, 0.55),
    }
  return {
    backgroundColor: pressed ? GLASS.fillActive : GLASS.fill,
    borderColor: pressed ? GLASS.borderActive : GLASS.border,
    borderTopColor: GLASS.highlight,
  }
}

export const PressableButton = ({
  onPress,
  title,
  variant = 'primary',
  tint = BLUE_PRIMARY,
  disabled,
  style,
  textStyle,
  pressableStyle,
}: PressableButtonProps) => {
  const { width } = useWindowDimensions()
  const isSmall = width < 400
  return (
    <Pressable onPress={onPress} disabled={disabled} style={pressableStyle}>
      {({ pressed }) => (
        <View
          style={[
            styles.button,
            variantStyle(disabled ? 'secondary' : variant, tint, pressed),
            pressed && styles.pressed,
            disabled && styles.disabled,
            style,
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              isSmall && styles.buttonTextSmall,
              variant === 'danger' && styles.dangerText,
              disabled && styles.disabledText,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    borderWidth: 1,
  },
  // 누르는 동안 살짝 눌리는 느낌
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.6,
  },
  buttonText: {
    padding: 20,
    textAlign: 'center',
    fontFamily: DM_SANS.BOLD,
    fontSize: 16,
    color: WHITE,
  },
  buttonTextSmall: {
    padding: 12,
  },
  dangerText: {
    color: RED_LIGHT,
  },
  disabledText: {
    color: GRAY,
  },
})
