import { DARK, GRAY, WHITE } from '@/theme/color'
import { DM_MONO, DM_SANS } from '@/theme/fonts'
import { StyleSheet, Text, View } from 'react-native'
import { BatteryIllustration } from './illustrations'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  Easing,
  withTiming,
} from 'react-native-reanimated'
import { useEffect } from 'react'

export const TodaySummary = () => {
  const containerOpacity = useSharedValue(0)

  const time = 1
  const parkeName = 'test1'

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }))

  useEffect(() => {
    containerOpacity.value = withDelay(
      400,
      withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) }),
    )
  }, [containerOpacity])

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>오늘의 현황</Text>
        <View style={styles.bleDescription}>
          <View style={styles.descSection}>
            <Text style={styles.todayTitle}>BLE 감지</Text>
            <View style={styles.cntSection}>
              <Text style={styles.todayBleCnt}>12</Text>
              <Text style={styles.todayCnt}>회</Text>
            </View>
          </View>
          <View style={styles.descSection}>
            <Text style={styles.todayTitle}>번호 변경</Text>
            <View style={styles.cntSection}>
              <Text style={styles.todayPhoneCnt}>9</Text>
              <Text style={styles.todayCnt}>회</Text>
            </View>
          </View>
        </View>
        <View style={styles.divider} />
        <View>
          <Text style={styles.title}>마지막 감지</Text>
          <Text
            style={styles.lastScanText}
          >{`${time}분 전 · ${parkeName}`}</Text>
          <View style={styles.battery}>
            <BatteryIllustration level={50} width={30} height={17} />
            <Text style={styles.batteryLevel}>50%</Text>
          </View>
        </View>
        <View style={styles.divider} />
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  wrapper: {
    maxWidth: 360,
    width: '100%',
    marginHorizontal: 'auto',
  },
  title: {
    color: GRAY,
    fontFamily: DM_SANS.BOLD,
    fontSize: 15,
  },
  bleDescription: {
    flexDirection: 'row',
    marginTop: 20,
  },
  descSection: {
    flex: 1,
  },
  todayTitle: {
    color: GRAY,
    fontFamily: DM_SANS.BOLD,
    fontSize: 14,
  },
  cntSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  todayBleCnt: {
    color: '#2d25ff',
    fontFamily: DM_SANS.BOLD,
    fontSize: 22,
  },
  todayPhoneCnt: {
    color: WHITE,
    fontFamily: DM_SANS.BOLD,
    fontSize: 22,
  },
  todayCnt: {
    color: GRAY,
    fontFamily: DM_SANS.BOLD,
    fontSize: 15,
    marginLeft: 3,
    marginBottom: 3,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: DARK,
    marginVertical: 15,
  },
  lastScanText: {
    color: WHITE,
    fontFamily: DM_MONO.MEDIUM,
    fontSize: 16,
    marginTop: 4,
  },
  battery: {
    flexDirection: 'row',
    position: 'absolute',
    top: 15,
    right: 5,
  },
  batteryLevel: {
    color: WHITE,
    fontFamily: DM_MONO.MEDIUM,
    marginLeft: 9,
  },
})
