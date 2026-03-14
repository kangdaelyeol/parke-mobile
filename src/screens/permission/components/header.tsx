import { GRAY, WHITE } from '@/theme/color'
import { DM_SANS } from '@/theme/fonts'
import { StyleSheet, Text, View } from 'react-native'

export const Header = () => {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>앱 접근권한 안내</Text>
        <Text style={styles.description}>
          Parké의 원활한 서비스 이용을 위해{'\n'}
          다음과 같은 기능이 필요합니다.
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  wrapper: {
    width: '100%',
    maxWidth: 360,
    marginHorizontal: 'auto',
  },
  title: {
    marginTop: 120,
    color: WHITE,
    fontFamily: DM_SANS.BOLD,
    fontSize: 33,
  },
  description: {
    marginTop: 10,
    color: GRAY,
    fontFamily: DM_SANS.MEDIUM,
    fontSize: 16,
    lineHeight: 22,
  },
})
