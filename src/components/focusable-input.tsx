import { JSX, useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { PRETENDARD } from '@/theme/fonts'
import { DARK, DARK_LIGHT, GRAY, GRAY_DEEP, WHITE } from '@/theme/color'
import { glassStyles, glassText, TEXT } from '@/theme/glass'
import { useThemeId } from '@/theme/themed'
import {
  CardIllustration,
  MessageIllustration,
  MyIllustration,
  PhoneIllustration,
} from '@/components/illustrations/focusable-input'

type IconName = 'my' | 'phone' | 'card' | 'message'

interface FocusableInputProps {
  title: string
  value: string
  placeholder: string
  iconName: IconName
  onChangeText: (v: string) => void
  // 유리 판 안에 놓일 때: 판보다 어둡게 파인 입력칸 (영상의 Target Mobile Number)
  inset?: boolean
}

const ICONS: Record<IconName, () => JSX.Element> = {
  my: MyIllustration,
  phone: PhoneIllustration,
  card: CardIllustration,
  message: MessageIllustration,
}

export const FocusableInput = ({
  title,
  value,
  onChangeText,
  placeholder,
  iconName,
  inset,
}: FocusableInputProps) => {
  const [focus, setFocus] = useState(false)
  const onFocus = () => setFocus(true)
  const offFocus = () => setFocus(false)
  const Icon = ICONS[iconName]
  const isGlass = useThemeId() === 'glass-dashboard'

  // 기본 테마: 어두운 칸 + 회색 테두리 / 글래스: 떠 있는 유리 칸(판 안에서는 파인 칸)
  const box = isGlass
    ? inset
      ? glassStyles.inset
      : glassStyles.field
    : classic.box
  const boxFocused = isGlass
    ? inset
      ? glassStyles.insetFocused
      : glassStyles.fieldFocused
    : classic.boxFocused

  return (
    <View style={isGlass ? styles.container : classic.container}>
      <Text
        style={[
          isGlass ? styles.title : classic.title,
          focus && (isGlass ? styles.titleFocused : classic.titleFocused),
        ]}
      >
        {title}
      </Text>
      <View>
        <TextInput
          onFocus={onFocus}
          onBlur={offFocus}
          style={[box, styles.input, focus && boxFocused]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={GRAY_DEEP}
        />
        <View style={styles.icon}>
          <Icon />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  input: {
    paddingLeft: 40,
    fontSize: 17,
    height: 55,
    color: WHITE,
    fontFamily: PRETENDARD.MEDIUM,
    maxWidth: 400,
  },
  title: glassText.label,
  titleFocused: {
    color: TEXT.primary,
  },
  icon: {
    position: 'absolute',
    height: '100%',
    justifyContent: 'center',
    left: 12,
  },
})

// 기본 테마 (처음 디자인)
const classic = StyleSheet.create({
  container: {
    gap: 10,
  },
  box: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DARK_LIGHT,
    backgroundColor: DARK,
  },
  boxFocused: {
    borderColor: GRAY,
  },
  title: {
    color: GRAY,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 13,
  },
  titleFocused: {
    color: WHITE,
  },
})
