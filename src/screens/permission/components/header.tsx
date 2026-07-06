import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import { GRAY, WHITE } from '@/theme/color'
import { DM_SANS } from '@/theme/fonts'

export const Header = () => {
  const { width } = useWindowDimensions()
  const isSmall = width < 400

  return (
    <View style={[styles.wrapper, isSmall && styles.wrapperSmall]}>
      <Text style={[styles.title, isSmall && styles.titleSmall]}>
        앱 접근권한 안내
      </Text>
      <Text style={[styles.description, isSmall && styles.descriptionSmall]}>
        Parké의 원활한 서비스 이용을 위해{'\n'}
        다음과 같은 기능이 필요합니다.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    maxWidth: 360,
    marginHorizontal: 'auto',
  },
  wrapperSmall: {
    maxWidth: 340,
  },
  title: {
    color: WHITE,
    fontFamily: DM_SANS.BOLD,
    marginTop: 120,
    fontSize: 33,
  },
  titleSmall: {
    marginTop: 100,
    fontSize: 20,
  },
  description: {
    color: GRAY,
    fontFamily: DM_SANS.MEDIUM,
    fontSize: 16,
    marginTop: 10,
    lineHeight: 22,
  },
  descriptionSmall: {
    fontSize: 13,
    marginTop: 10,
    lineHeight: 18,
  },
})
