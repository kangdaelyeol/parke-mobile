import { useState } from 'react'
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import { glassStyles, TEXT } from '../tokens'
import { PRETENDARD } from '@/theme/fonts'

interface SearchFieldProps extends Omit<TextInputProps, 'style'> {
  style?: StyleProp<ViewStyle>
}

// 검색칸 (영상 상단 바): 판 안에 파인 칸 + 돋보기
export const SearchField = ({
  style,
  onFocus,
  onBlur,
  ...input
}: SearchFieldProps) => {
  const [focus, setFocus] = useState(false)
  return (
    <View
      style={[
        glassStyles.inset,
        styles.box,
        focus && glassStyles.insetFocused,
        style,
      ]}
    >
      <FontAwesome6
        name="magnifying-glass"
        iconStyle="solid"
        size={13}
        color={TEXT.tertiary}
      />
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
  )
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 40,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    padding: 0,
    color: TEXT.primary,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 14,
  },
})
