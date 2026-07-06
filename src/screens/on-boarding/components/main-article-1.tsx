import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import { OnBoardingIcon1_1 } from '@/assets/illustrations'
import { DM_SANS } from '@/theme/fonts'
import { GRAY, WHITE } from '@/theme/color'

export const MainArticle1 = () => {
  // const { width, height } = useWindowDimensions()
  const { width } = useWindowDimensions()
  const widthRatio = 466 / 190
  const style =
    width < 400
      ? {
          imgHeight: 100,
          imgWidth: 100 * widthRatio,
          title: { fontSize: 25, marginTop: 20 },
          subTitle: { fontSize: 17, marginTop: 20 },
          onBoardingIllustrator1: {
            marginTop: 100,
          },
        }
      : {
          imgHeight: 150,
          imgWidth: 150 * widthRatio,
          title: { fontSize: 28, marginTop: 20 },
          subTitle: { fontSize: 17, marginTop: 20 },
          onBoardingIllustrator1: {
            marginTop: 150,
          },
        }

  return (
    <View style={styles.container}>
      <OnBoardingIcon1_1
        style={{
          ...styles.onBoardingIllustrator1,
          ...style.onBoardingIllustrator1,
        }}
        width={style.imgWidth}
        height={style.imgHeight}
      />
      <View style={styles.textContainer}>
        <Text style={{ ...styles.title, ...style.title }}>
          가족이 함께 쓰는 차량, 전화번호는?
        </Text>
        <Text style={{ ...styles.subTitle, ...style.subTitle }}>
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
    color: WHITE,
    fontFamily: DM_SANS.BOLD,
  },
  subTitle: {
    fontFamily: DM_SANS.MEDIUM,
    color: GRAY,
  },
})
