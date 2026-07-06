import {
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import { OnBoardingIcon3 } from '@/assets/illustrations'
import { GRAY, WHITE } from '@/theme/color'
import { DM_SANS } from '@/theme/fonts'

export const MainArticle3 = () => {
  const { width } = useWindowDimensions()
  const style =
    width < 400
      ? {
          imgWidth: 300,
          imgHeight: 300 * (225 / 400),
        }
      : {
          imgWidth: 400,
          imgHeight: 225,
        }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>지금 시작하세요</Text>
      <Text style={styles.subTitle}>
        Parké와 함께 스마트한 주차 경험을 시작하세요
      </Text>
      <Image
        style={styles.image}
        source={OnBoardingIcon3}
        width={style.imgWidth}
        height={style.imgHeight}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', width: '100%', overflow: 'hidden' },
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
