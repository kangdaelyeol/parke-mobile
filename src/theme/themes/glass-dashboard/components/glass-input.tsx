import { useState } from 'react'
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import { glassStyles, glassText, TEXT } from '../tokens'
import { PRETENDARD } from '@/theme/fonts'
import { SolidIconName } from './types'

interface GlassInputProps extends Omit<TextInputProps, 'style'> {
  // 칸 위 이름 (영상의 Target Mobile Number)
  label?: string
  // 칸 왼쪽 아이콘
  icon?: SolidIconName
  style?: StyleProp<ViewStyle>
}

// 이름 + 판 안에 파인 입력칸 (영상의 OTP 시뮬레이터)
export const GlassInput = ({
  label,
  icon,
  style,
  onFocus,
  onBlur,
  ...input
}: GlassInputProps) => {
  const [focus, setFocus] = useState(false)
  return (
    <View style={[styles.container, style]}>
      {!!label && (
        <Text style={[glassText.label, focus && styles.labelFocused]}>
          {label}
        </Text>
      )}
      <View
        style={[
          glassStyles.inset,
          styles.box,
          focus && glassStyles.insetFocused,
        ]}
      >
        {icon && (
          <FontAwesome6
            name={icon}
            iconStyle="solid"
            size={13}
            color={TEXT.tertiary}
          />
        )}
        <TextInput
          {...input}
          onFocus={e => {
            setFocus(true)
            onFocus?.(e)
          }}
          onBlur={e => {
            setFocus(false)
            onBlur?.(e)
          }}
          placeholderTextColor={TEXT.faint}
          style={styles.input}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  labelFocused: {
    color: TEXT.primary,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 46,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    padding: 0,
    color: TEXT.primary,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 15,
  },
})
