import { Image, StyleSheet, Text, View } from 'react-native'
import { OnBoardingIcon3 } from '@/assets/illustrations'
import { GRAY, WHITE } from '@/theme/color'
import { DM_SANS } from '@/theme/fonts'

export const MainArticle3 = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>지금 시작하세요</Text>
      <Text style={styles.subTitle}>
        Parké와 함께 스마트한 주차 경험을 시작하세요
      </Text>
      <Image
        style={styles.image}
        source={OnBoardingIcon3}
        width={400}
        height={225}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', width: '100%' },
  title: {
    color: WHITE,
    fontFamily: DM_SANS.BOLD,
    fontSize: 35,
    marginTop: 35,
  },
  subTitle: {
    color: GRAY,
    fontFamily: DM_SANS.MEDIUM,
    fontSize: 18,
    marginTop: 15,
    letterSpacing: -0.1,
  },
  illustrator: {
    marginTop: 70,
    marginHorizontal: 'auto',
  },
  image: {
    marginVertical: 'auto',
  },
})
