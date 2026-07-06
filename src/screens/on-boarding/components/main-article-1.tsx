import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import { OnBoardingIcon1_1 } from '@/assets/illustrations'
import { DM_SANS } from '@/theme/fonts'
import { GRAY, WHITE } from '@/theme/color'

export const MainArticle1 = () => {
  // const { width, height } = useWindowDimensions()
  const { width } = useWindowDimensions()
  const widthRatio = 466 / 190

  const isSmall = width < 400

  return (
    <View style={styles.container}>
      <OnBoardingIcon1_1
        style={[
          styles.onBoardingIllustrator1,
          isSmall && styles.onBoardingIllustrator1Small,
        ]}
        width={isSmall ? 100 * widthRatio : 150 * widthRatio}
        height={isSmall ? 100 : 150}
      />
      <View style={styles.textContainer}>
        <Text style={[styles.title, isSmall && styles.titleSmall]}>
          가족이 함께 쓰는 차량, 전화번호는?
        </Text>
        <Text style={[styles.subTitle, isSmall && styles.subTitleSmall]}>
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
    marginTop: 150,
    marginHorizontal: 'auto',
  },
  onBoardingIllustrator1Small: {
    marginTop: 100,
  },
  textContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  title: {
    color: WHITE,
    fontFamily: DM_SANS.BOLD,
    fontSize: 28,
    marginTop: 20,
  },
  titleSmall: { fontSize: 23, marginTop: 20 },
  subTitle: {
    fontFamily: DM_SANS.MEDIUM,
    color: GRAY,
    fontSize: 17,
    marginTop: 20,
  },
  subTitleSmall: { fontSize: 14, marginTop: 20 },
})
