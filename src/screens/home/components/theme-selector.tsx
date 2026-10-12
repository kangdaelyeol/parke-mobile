import { Pressable, StyleSheet, Text, View } from 'react-native'
import { CARD_THEMES, CardTheme } from '@/domain/card'
import { HomeThemeSelectorProps } from '@home/types'
import { PRETENDARD } from '@/theme/fonts'
import { DARK, DARK_LIGHT, GRAY, WHITE } from '@/theme/color'

const THEME_LABEL: Record<CardTheme, string> = {
  dark: 'Dark',
  light: 'Light',
  amber: 'Amber',
  mint: 'Mint',
}

const THEME_COLOR: Record<CardTheme, string> = {
  dark: '#1c1c1c',
  light: '#f0f0f0',
  amber: '#ffb300',
  mint: '#3ddc97',
}

export const ThemeSelector = ({ value, onChange }: HomeThemeSelectorProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>테마</Text>
      <View style={styles.list}>
        {CARD_THEMES.map(theme => (
          <Pressable
            key={theme}
            style={styles.pressable}
            onPress={() => onChange(theme)}
          >
            <View style={[styles.chip, theme === value && styles.chipSelected]}>
              <View
                style={[styles.dot, { backgroundColor: THEME_COLOR[theme] }]}
              />
              <Text
                style={[styles.label, theme === value && styles.labelSelected]}
              >
                {THEME_LABEL[theme]}
              </Text>
            </View>
          </Pressable>
        ))}
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
  list: {
    flexDirection: 'row',
    gap: 8,
  },
  pressable: {
    flex: 1,
  },
  chip: {
    height: 55,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DARK_LIGHT,
    backgroundColor: DARK,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  chipSelected: {
    borderColor: WHITE,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: GRAY,
  },
  label: {
    color: GRAY,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 12,
  },
  labelSelected: {
    color: WHITE,
  },
})
