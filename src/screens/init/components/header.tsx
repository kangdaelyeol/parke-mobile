import { StyleSheet, Text, View } from 'react-native'
import { LogoText } from '@/components'
import { GRAY_LIGHT, WHITE } from '@/theme/color'
import { DM_SANS } from '@/theme/fonts'

export const Header = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoTextContainer}>
        <LogoText fontSize={22} letterSpacing={5} />
      </View>
      <Text style={styles.title}>기본 정보를 입력해주세요</Text>
      <Text style={styles.subTitle}>
        서비스 이용을 위해 간단한 정보가 필요해요
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logoTextContainer: {
    marginTop: 80,
  },
  title: {
    color: WHITE,
    fontSize: 26,
    marginTop: 40,
    fontFamily: DM_SANS.BOLD,
  },
  subTitle: {
    color: GRAY_LIGHT,
    fontFamily: DM_SANS.MEDIUM,
    marginTop: 7,
  },
})
