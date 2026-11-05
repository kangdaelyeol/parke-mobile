import { ComponentProps } from 'react'
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import { DM_SANS } from '@/theme/fonts'
import {
  BLUE_PRIMARY,
  DARK,
  DARK_LIGHT,
  GRAY,
  GRAY_DEEP,
  RED,
  RED_LIGHT,
  WHITE,
} from '@/theme/color'
import { GlassButton } from '@/theme/themes/glass-dashboard/components/glass-button'

// 글래스 버튼과 같은 props를 받는다 (테마를 바꿔도 부르는 쪽은 그대로)
type ClassicButtonProps = ComponentProps<typeof GlassButton>

// 처음 디자인의 버튼 색 [기본, 누름]
const COLORS = {
  primary: { background: [BLUE_PRIMARY, '#1732ff'], text: WHITE },
  secondary: {
    background: [DARK, DARK_LIGHT],
    border: [DARK_LIGHT, GRAY_DEEP],
    text: WHITE,
  },
  danger: { border: [RED, RED_LIGHT], text: RED_LIGHT },
  disabled: { background: [DARK_LIGHT, DARK_LIGHT], text: GRAY },
} as const

// 기본 테마 버튼: 파란 버튼 / 어두운 판 버튼 / 빨간 테두리 버튼
export const ClassicButton = ({
  onPress,
  title,
  variant = 'primary',
  tint,
  icon,
  size = 'md',
  disabled,
  style,
  textStyle,
  pressableStyle,
}: ClassicButtonProps) => {
  const { width } = useWindowDimensions()
  const isSmall = width < 400
  const small = size === 'sm'
  const colors = disabled ? COLORS.disabled : COLORS[variant]
  const background = 'background' in colors ? colors.background : null
  const border = 'border' in colors ? colors.border : null

  return (
    <Pressable onPress={onPress} disabled={disabled} style={pressableStyle}>
      {({ pressed }) => (
        <View
          style={[
            styles.button,
            small && styles.buttonSm,
            !!icon && styles.withIcon,
            background && { backgroundColor: background[pressed ? 1 : 0] },
            border && [styles.border, { borderColor: border[pressed ? 1 : 0] }],
            // tint: 그 색으로 채우고 누르는 동안 살짝 흐리게
            !disabled &&
              variant === 'primary' &&
              tint && { backgroundColor: tint },
            !disabled && tint && pressed && styles.tintPressed,
            style,
          ]}
        >
          {icon && (
            <FontAwesome6
              name={icon}
              iconStyle="solid"
              size={small ? 11 : 14}
              color={colors.text}
            />
          )}
          <Text
            style={[
              styles.text,
              isSmall && styles.textCompact,
              small && styles.textSm,
              !!icon && styles.textWithIcon,
              { color: colors.text },
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
  },
  buttonSm: {
    borderRadius: 10,
  },
  withIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },
  border: {
    borderWidth: 1,
  },
  tintPressed: {
    opacity: 0.85,
  },
  text: {
    padding: 20,
    textAlign: 'center',
    fontFamily: DM_SANS.BOLD,
    fontSize: 16,
  },
  textCompact: {
    padding: 12,
  },
  textSm: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    fontSize: 12,
  },
  textWithIcon: {
    paddingHorizontal: 0,
  },
})
