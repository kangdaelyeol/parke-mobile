import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import { OnBoardingIcon2 } from '@/assets/illustrations'
import { GRAY, WHITE } from '@/theme/color'
import { DM_SANS } from '@/theme/fonts'

export const MainArticle2 = () => {
  const { width } = useWindowDimensions()
  const style =
    width < 400
      ? {
          imgWidth: 200,
          imgHeight: 200,
          titleStyle: { fontSize: 20, lineHeight: 30, marginTop: 20 },
          subTitleStyle: { fontSize: 13, lineHeight: 20, marginTop: 10 },
        }
      : {
          imgWidth: 300,
          imgHeight: 300,
          titleStyle: { fontSize: 33, marginTop: 30 },
          subTitleStyle: { fontSize: 19, lineHeight: 25, marginTop: 20 },
        }

  return (
    <View style={styles.container}>
      <OnBoardingIcon2
        width={style.imgWidth}
        height={style.imgHeight}
        style={styles.illustrator}
      />
      <Text style={{ ...styles.title, ...style.titleStyle }}>
        QR 스캔시 운전자에 맞는{'\n'}번호 자동 전환
      </Text>

      <Text style={{ ...styles.subTitle, ...style.subTitleStyle }}>
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
  },
  subTitle: {
    color: GRAY,
    textAlign: 'center',
    fontFamily: DM_SANS.MEDIUM,
  },
})
