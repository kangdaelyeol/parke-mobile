import { StyleSheet, Text, View } from 'react-native'
import { OnBoardingIcon1_1 } from '@/assets/illustrations'
import { DM_SANS } from '@/theme/fonts'
import { GRAY, WHITE } from '@/theme/color'

export const MainArticle1 = () => {
  // const { width, height } = useWindowDimensions()
  const imgHeight = 100
  const widthRatio = 466 / 190
  const imgWidth = imgHeight * widthRatio
  return (
    <View style={styles.container}>
      <OnBoardingIcon1_1
        style={styles.onBoardingIllustrator1}
        width={imgWidth}
        height={imgHeight}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>가족이 함께 쓰는 차량, 전화번호는?</Text>
        <Text style={styles.subTitle}>
          운전자가 바뀔 때마다 주차번호판을 교체하는 불편함
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  onBoardingIllustrator1: {
    marginTop: 100,
    marginHorizontal: 'auto',
  },
  textContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    color: WHITE,
    fontFamily: DM_SANS.BOLD,
  },
  subTitle: {
    marginTop: 20,
    fontSize: 17,
    fontFamily: DM_SANS.MEDIUM,
    color: GRAY,
  },
})
