import { JSX, useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { PRETENDARD } from '@/theme/fonts'
import { GRAY_DEEP, WHITE } from '@/theme/color'
import { glassStyles, glassText, TEXT } from '@/theme/glass'
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

  return (
    <View style={styles.container}>
      <Text style={[styles.title, focus && styles.titleFocused]}>{title}</Text>
      <View>
        <TextInput
          onFocus={onFocus}
          onBlur={offFocus}
          style={[
            inset ? glassStyles.inset : glassStyles.field,
            styles.input,
            focus &&
              (inset ? glassStyles.insetFocused : glassStyles.fieldFocused),
          ]}
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
