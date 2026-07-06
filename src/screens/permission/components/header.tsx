import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import { GRAY, WHITE } from '@/theme/color'
import { DM_SANS } from '@/theme/fonts'

export const Header = () => {
  const { width } = useWindowDimensions()
  const style =
    width < 400
      ? {
          titleStyle: {
            marginTop: 100,
            fontSize: 20,
          },
          subTitleStyle: { fontSize: 13, marginTop: 10 },
        }
      : {
          titleStyle: {
            marginTop: 120,
            fontSize: 33,
          },
          subTitleStyle: {
            fontSize: 16,
            marginTop: 10,
            lineHeight: 22,
          },
        }

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={{ ...styles.title, ...style.titleStyle }}>
          앱 접근권한 안내
        </Text>
        <Text style={{ ...styles.description, ...style.subTitleStyle }}>
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
    color: WHITE,
    fontFamily: DM_SANS.BOLD,
  },
  description: {
    color: GRAY,
    fontFamily: DM_SANS.MEDIUM,
  },
})
