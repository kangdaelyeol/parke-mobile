import { useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { PRETENDARD } from '@/theme/fonts'
import { DARK, DARK_LIGHT, GRAY, WHITE } from '@/theme/color'
import { MyIllustration, PhoneIllustration } from './illustrations'

type IconName = 'my' | 'phone'

interface FocusableInputProps {
  title: string
  value: string
  onChangeText: (v: string) => void
  placeholder: string
  iconName: IconName
}

interface InputIconProps {
  iconName: IconName
}

const InputIcon = ({ iconName }: InputIconProps) => {
  switch (iconName) {
    case 'my':
      return <MyIllustration />
    case 'phone':
      return <PhoneIllustration />
  }
}

export const FocusableInput = ({
  title,
  value,
  onChangeText,
  placeholder,
  iconName,
}: FocusableInputProps) => {
  const [focus, setFocus] = useState(false)
  const onFocus = () => setFocus(true)
  const offFocus = () => setFocus(false)
  return (
    <View style={styles.container}>
      <Text style={[styles.title, focus && styles.titleFocused]}>{title}</Text>
      <View>
        <TextInput
          onFocus={onFocus}
          onBlur={offFocus}
          style={[styles.input, focus && styles.inputFocused]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
        />
        <View style={styles.icon}>
          <InputIcon iconName={iconName} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DARK_LIGHT,
    borderBottomWidth: 1,
    paddingLeft: 40,
    fontSize: 17,
    height: 55,
    color: WHITE,
    fontFamily: PRETENDARD.MEDIUM,
    maxWidth: 400,
    backgroundColor: DARK,
  },
  title: {
    color: GRAY,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 13,
  },
  titleFocused: {
    color: WHITE,
  },
  inputFocused: {
    borderColor: GRAY,
  },
  icon: {
    position: 'absolute',
    height: '100%',
    justifyContent: 'center',
    left: 12,
  },
})
