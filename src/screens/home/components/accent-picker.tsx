import { useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { isCardAccent } from '@/domain/card'
import { HomeAccentPickerProps } from '@home/types'
import { DM_MONO, PRETENDARD } from '@/theme/fonts'
import { DARK, DARK_LIGHT, GRAY, WHITE } from '@/theme/color'

const ACCENT_PRESETS = [
  '#383bf9',
  '#ff5500',
  '#ffb300',
  '#3ddc97',
  '#ed3a3a',
  '#f0f0f0',
]

export const AccentPicker = ({
  value,
  onChangeText,
}: HomeAccentPickerProps) => {
  const [focus, setFocus] = useState(false)

  return (
    <View style={styles.container}>
      <Text style={[styles.title, focus && styles.titleFocused]}>
        강조 색상
      </Text>
      <View style={styles.presetList}>
        {ACCENT_PRESETS.map(color => (
          <Pressable key={color} onPress={() => onChangeText(color)}>
            <View
              style={[
                styles.preset,
                { backgroundColor: color },
                color === value.toLowerCase() && styles.presetSelected,
              ]}
            />
          </Pressable>
        ))}
      </View>
      <View>
        <TextInput
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={[styles.input, focus && styles.inputFocused]}
          value={value}
          onChangeText={onChangeText}
          placeholder="#RRGGBB"
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={7}
        />
        <View style={styles.icon}>
          <View
            style={[
              styles.preview,
              isCardAccent(value) && { backgroundColor: value },
            ]}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  title: {
    color: GRAY,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 13,
  },
  titleFocused: {
    color: WHITE,
  },
  presetList: {
    flexDirection: 'row',
    gap: 12,
  },
  preset: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: DARK_LIGHT,
  },
  presetSelected: {
    borderColor: WHITE,
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DARK_LIGHT,
    paddingLeft: 40,
    fontSize: 17,
    height: 55,
    color: WHITE,
    fontFamily: DM_MONO.MEDIUM,
    maxWidth: 400,
    backgroundColor: DARK,
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
  preview: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: GRAY,
  },
})
