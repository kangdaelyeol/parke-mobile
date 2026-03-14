import { View, StyleSheet, Text } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { LogoIcon1024 } from '@/assets/logo'
import { DM_SANS, PRETENDARD } from '@/theme/fonts'
import { BLUE_PRIMARY, GRAY_DEEP, WHITE } from '@/theme/color'
export const Main = () => {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.introSection}>
          <View style={styles.appIcon}>
            <LinearGradient
              colors={['rgba(59, 59, 249, 0.3)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            />
            <LogoIcon1024 style={styles.iconImage} width={80} height={80} />
          </View>
          <View style={styles.titleSection}>
            <Text style={styles.iconText}>PARK</Text>
            <Text style={[styles.iconText, styles.accent]}>É</Text>
          </View>
          <Text style={styles.subTitle}>Smart Parking Solution</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    width: '100%',
    maxWidth: 400,
    marginHorizontal: 'auto',
    flex: 1,
    justifyContent: 'center',
  },
  introSection: {
    marginHorizontal: 'auto',
    alignItems: 'center',
  },
  appIcon: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 1.6,
    borderColor: GRAY_DEEP,
    overflow: 'hidden',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  iconImage: {},
  titleSection: {
    flexDirection: 'row',
    marginTop: 20,
  },
  iconText: {
    color: WHITE,
    fontSize: 40,
    fontFamily: DM_SANS.REGULAR,
    letterSpacing: 11,
    textAlign: 'center',
  },
  accent: {
    color: BLUE_PRIMARY,
  },
  subTitle: {
    color: GRAY_DEEP,
    fontFamily: PRETENDARD.MEDIUM,
    letterSpacing: 1,
    fontSize: 16,
    marginTop: 20,
  },
})
