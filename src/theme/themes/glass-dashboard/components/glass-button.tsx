import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import { PRETENDARD } from '@/theme/fonts'
import {
  ACCENT_FILL,
  ACCENT_GLOW,
  GLASS,
  TEXT,
  TONE,
  withAlpha,
} from '../tokens'
import { SolidIconName } from './types'
import { useIsSmallScreen } from '@/theme/layout'

// primary: 강조색 유리 (기본 파랑, tint로 다른 색)
// secondary: 투명한 유리 (취소·완료 등)
// danger: 빨간 테두리 유리 (삭제·탈퇴)
export type GlassButtonVariant = 'primary' | 'secondary' | 'danger'

interface GlassButtonProps {
  onPress: () => void
  title: string
  variant?: GlassButtonVariant
  // primary 색 (#RRGGBB). 없으면 강조색 그라데이션
  tint?: string
  // 글자 앞 아이콘
  icon?: SolidIconName
  // sm: 목록 안의 작은 버튼 (영상의 Reset 2FA · Logs)
  size?: 'md' | 'sm'
  // 흐리게 표시하고 누를 수 없음
  disabled?: boolean
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  pressableStyle?: StyleProp<ViewStyle>
}

// 위쪽이 살짝 밝은 광택 (tint 버튼용)
const SHEEN =
  'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.04) 55%, rgba(255,255,255,0) 100%)'

const tintStyle = (tint: string, pressed: boolean): ViewStyle => ({
  backgroundColor: withAlpha(tint, pressed ? 0.95 : 0.85),
  borderColor: withAlpha(tint, 0.9),
  borderTopColor: 'rgba(255,255,255,0.35)',
  experimental_backgroundImage: SHEEN,
  boxShadow: `0px 6px 18px ${withAlpha(tint, pressed ? 0.2 : 0.35)}`,
})

// 버튼 (영상의 + New 2FA Rule · Reset 2FA · Logs)
export const GlassButton = ({
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
}: GlassButtonProps) => {
  const isSmall = useIsSmallScreen()
  const small = size === 'sm'
  const kind = disabled ? 'secondary' : variant
  const textColor =
    kind === 'danger' ? TONE.danger : disabled ? TEXT.tertiary : TEXT.primary

  return (
    <Pressable onPress={onPress} disabled={disabled} style={pressableStyle}>
      {({ pressed }) => (
        <View
          style={[
            styles.button,
            small ? styles.buttonSm : isSmall && styles.buttonCompact,
            kind === 'primary' &&
              (tint ? tintStyle(tint, pressed) : styles.primary),
            kind === 'primary' && !tint && pressed && styles.primaryPressed,
            kind === 'secondary' && styles.secondary,
            kind === 'secondary' && pressed && styles.secondaryPressed,
            kind === 'danger' && styles.danger,
            kind === 'danger' && pressed && styles.dangerPressed,
            pressed && styles.pressed,
            disabled && styles.disabled,
            style,
          ]}
        >
          {icon && (
            <FontAwesome6
              name={icon}
              iconStyle="solid"
              size={small ? 11 : 14}
              color={textColor}
            />
          )}
          <Text
            style={[
              styles.text,
              small && styles.textSm,
              { color: textColor },
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 58,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
  },
  buttonCompact: {
    minHeight: 46,
  },
  buttonSm: {
    minHeight: 30,
    paddingHorizontal: 12,
    gap: 5,
    borderRadius: 9,
  },
  // 기본: 강조색 가로 그라데이션 + 위쪽 광택 + 같은 색 그림자 (영상의 New 2FA Rule)
  primary: {
    borderColor: 'rgba(255,255,255,0.14)',
    borderTopColor: 'rgba(255,255,255,0.32)',
    experimental_backgroundImage: ACCENT_FILL,
    boxShadow: ACCENT_GLOW,
  },
  primaryPressed: {
    opacity: 0.9,
    boxShadow: '0px 3px 10px rgba(56,59,249,0.28)',
  },
  secondary: {
    backgroundColor: GLASS.fill,
    borderColor: GLASS.border,
    borderTopColor: GLASS.highlight,
  },
  secondaryPressed: {
    backgroundColor: GLASS.fillActive,
    borderColor: GLASS.borderActive,
  },
  danger: {
    backgroundColor: withAlpha(TONE.danger, 0.08),
    borderColor: withAlpha(TONE.danger, 0.3),
    borderTopColor: withAlpha(TONE.danger, 0.5),
  },
  dangerPressed: {
    backgroundColor: withAlpha(TONE.danger, 0.16),
  },
  // 누르는 동안 살짝 눌리는 느낌
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontFamily: PRETENDARD.BOLD,
    fontSize: 16,
    textAlign: 'center',
  },
  textSm: {
    fontSize: 12,
  },
})
