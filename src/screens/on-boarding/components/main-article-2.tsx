import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import { OnBoardingIcon2 } from '@/assets/illustrations'
import { GRAY, WHITE } from '@/theme/color'
import { DM_SANS } from '@/theme/fonts'

export const MainArticle2 = () => {
  const { width } = useWindowDimensions()
  const isSmall = width < 400

  return (
    <View style={styles.container}>
      <OnBoardingIcon2
        width={isSmall ? 200 : 300}
        height={isSmall ? 200 : 300}
        style={styles.illustrator}
      />
      <Text style={[styles.title, isSmall && styles.titleSmall]}>
        QR 스캔시 운전자에 맞는{'\n'}번호 자동 전환
      </Text>

      <Text style={[styles.subTitle, isSmall && styles.subTitleSmall]}>
        BLE 기반으로 운전자를 자동 인식하여{'\n'}실시간으로 연락처를 변경합니다
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', width: '100%', overflow: 'hidden' },
  illustrator: {
    marginTop: 50,
    marginHorizontal: 'auto',
  },
  title: {
    color: WHITE,
    fontFamily: DM_SANS.BOLD,
    textAlign: 'center',
    fontSize: 33,
    marginTop: 30,
  },
  titleSmall: { fontSize: 24, marginTop: 20 },
  subTitle: {
    color: GRAY,
    textAlign: 'center',
    fontFamily: DM_SANS.MEDIUM,
    fontSize: 19,
    lineHeight: 25,
    marginTop: 20,
  },
  subTitleSmall: { fontSize: 12, lineHeight: 17, marginTop: 10 },
})
