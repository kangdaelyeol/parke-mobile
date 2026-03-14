import { BLUE_PRIMARY, GRAY_LIGHT } from '@/theme/color'
import { DM_SANS } from '@/theme/fonts'
import { StyleSheet, Text, View } from 'react-native'

interface LogoTextProps {
  fontSize?: number
  letterSpacing?: number
}

export const LogoText = ({
  fontSize = 16,
  letterSpacing = 0,
}: LogoTextProps) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, { fontSize, letterSpacing }]}>PARK</Text>
      <Text style={[styles.text, styles.accent, { fontSize, letterSpacing }]}>
        É
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  text: {
    color: GRAY_LIGHT,
    fontFamily: DM_SANS.REGULAR,
  },
  accent: {
    color: BLUE_PRIMARY,
  },
})
