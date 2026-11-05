import { memo, ReactNode } from 'react'
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import { GLASS, glassStyles, TEXT, Tone, TONE } from '../tokens'
import { PRETENDARD } from '@/theme/fonts'
import { IconTile } from './icon-tile'
import { SolidIconName } from './types'

interface GlassRowProps {
  title: string
  subtitle?: string
  icon?: SolidIconName
  tone?: Tone
  // tone 대신 임의의 아이콘 색
  iconColor?: string
  iconVariant?: 'tinted' | 'glass'
  // 오른쪽 글자 값
  value?: string
  // 오른쪽에 둘 요소 (알약, 토글, 버튼)
  right?: ReactNode
  // 오른쪽 끝 › (다른 화면으로 이동)
  chevron?: boolean
  // 고른 줄 (영상의 메뉴 Overview): 밝은 유리 알약을 깔고 아이콘을 강조색으로
  active?: boolean
  danger?: boolean
  // 아래 구분선 (목록 안에서 마지막 줄이 아니면)
  divider?: boolean
  disabled?: boolean
  onPress?: () => void
  style?: StyleProp<ViewStyle>
}

// 목록 한 줄: 아이콘 타일 + 이름/설명 + 오른쪽 값 (영상의 메뉴 항목, 보안 로그, 제공자 상태)
export const GlassRow = memo(
  ({
    title,
    subtitle,
    icon,
    tone = 'neutral',
    iconColor,
    iconVariant = 'tinted',
    value,
    right,
    chevron,
    active,
    danger,
    divider,
    disabled,
    onPress,
    style,
  }: GlassRowProps) => (
    <Pressable onPress={onPress} disabled={disabled || !onPress}>
      {({ pressed }) => (
        <View
          style={[
            styles.row,
            divider && styles.divider,
            active && [glassStyles.active, styles.activeRow],
            pressed && !active && styles.pressed,
            disabled && styles.disabled,
            style,
          ]}
        >
          {icon && (
            <IconTile
              icon={icon}
              tone={danger ? 'danger' : active ? 'accent' : tone}
              color={iconColor}
              variant={iconVariant}
            />
          )}
          <View style={styles.texts}>
            <Text
              style={[styles.title, danger && styles.dangerText]}
              numberOfLines={1}
            >
              {title}
            </Text>
            {!!subtitle && (
              <Text style={styles.subtitle} numberOfLines={2}>
                {subtitle}
              </Text>
            )}
          </View>
          {value !== undefined && (
            <Text style={styles.value} numberOfLines={1}>
              {value}
            </Text>
          )}
          {right}
          {chevron && (
            <FontAwesome6
              name="chevron-right"
              iconStyle="solid"
              size={11}
              color={TEXT.faint}
            />
          )}
        </View>
      )}
    </Pressable>
  ),
)

const styles = StyleSheet.create({
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: GLASS.divider,
  },
  activeRow: {
    borderRadius: 12,
  },
  pressed: {
    backgroundColor: GLASS.pressed,
  },
  disabled: {
    opacity: 0.45,
  },
  texts: {
    flex: 1,
    gap: 3,
  },
  title: {
    color: TEXT.strong,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 15,
  },
  subtitle: {
    color: TEXT.tertiary,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 12,
  },
  value: {
    maxWidth: '50%',
    color: TEXT.secondary,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 13,
  },
  dangerText: {
    color: TONE.danger,
  },
})
