import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { DARK, GRAY, WHITE } from '@/theme/color'
import { DM_MONO, DM_SANS } from '@/theme/fonts'
import { BatteryIllustration } from './illustrations'
import { useTodaySummaryViewModel } from '@/view-model/home'

export const TodaySummary = () => {
  const { state, animated } = useTodaySummaryViewModel()
  const { width } = useWindowDimensions()
  const isSmall = width < 400

  return (
    <Animated.View style={[styles.container, animated.containerStyle]}>
      <View style={styles.wrapper}>
        <Text style={[styles.title, isSmall && styles.titleSmall]}>
          오늘의 현황
        </Text>
        <View style={styles.bleDescription}>
          <View
            style={[styles.descSection, isSmall && styles.descSectionSmall]}
          >
            <Text
              style={[styles.todayTitle, isSmall && styles.todayTitleSmall]}
            >
              BLE 감지
            </Text>
            <View style={styles.cntSection}>
              <Text style={styles.todayBleCnt}>{state.bleScanCount}</Text>
              <Text style={styles.todayCnt}>회</Text>
            </View>
          </View>
          <View
            style={[styles.descSection, isSmall && styles.descSectionSmall]}
          >
            <Text
              style={[styles.todayTitle, isSmall && styles.todayTitleSmall]}
            >
              번호 변경
            </Text>
            <View style={styles.cntSection}>
              <Text style={styles.todayPhoneCnt}>{state.phoneChangeCount}</Text>
              <Text style={styles.todayCnt}>회</Text>
            </View>
          </View>
        </View>
        <View style={styles.divider} />
        <View>
          <Text style={[styles.title, isSmall && styles.titleSmall]}>
            마지막 감지
          </Text>
          <Text
            style={styles.lastScanText}
          >{`${state.lastScanTime}분 전 · ${state.deviceName}`}</Text>
          <View style={styles.battery}>
            <BatteryIllustration level={50} width={30} height={17} />
            <Text style={styles.batteryLevel}>{`${state.batteryLevel}%`}</Text>
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
    paddingTop: 10,
    width: '100%',
    marginHorizontal: 'auto',
  },
  title: {
    color: GRAY,
    fontFamily: DM_SANS.BOLD,
    fontSize: 15,
  },
  titleSmall: {
    fontSize: 12,
  },
  bleDescription: {
    flexDirection: 'row',
  },
  descSection: {
    flex: 1,
    marginTop: 20,
  },
  descSectionSmall: {
    marginTop: 10,
  },
  todayTitle: {
    color: GRAY,
    fontFamily: DM_SANS.BOLD,
    fontSize: 14,
  },
  todayTitleSmall: { fontSize: 12 },
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
