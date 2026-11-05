import { StyleSheet, View } from 'react-native'
import Animated from 'react-native-reanimated'
import {
  GlassRow,
  GlassSurface,
  SectionLabel,
  SolidIconName,
  StatCard,
  StatusPill,
} from '@/components'
import { GLASS, Tone } from '@/theme/glass'
import { useTodaySummaryViewModel } from '@home/view-model'

const batteryIcon = (level: number): SolidIconName => {
  if (level >= 80) return 'battery-full'
  if (level >= 60) return 'battery-three-quarters'
  if (level >= 35) return 'battery-half'
  if (level >= 10) return 'battery-quarter'
  return 'battery-empty'
}

const batteryTone = (level: number): Tone =>
  level >= 50 ? 'success' : level >= 20 ? 'warning' : 'danger'

// 오늘의 현황: 유리 판 하나 안에 통계 두 칸 + 마지막 감지 줄을 묶는다
export const TodaySummary = () => {
  const { state, animated } = useTodaySummaryViewModel()
  const battery = Number(state.batteryLevel) || 0

  return (
    <Animated.View style={[styles.container, animated.containerStyle]}>
      <GlassSurface style={styles.panel}>
        <SectionLabel>오늘의 현황</SectionLabel>
        <View style={styles.stats}>
          <StatCard
            bare
            style={styles.stat}
            title="BLE 감지"
            value={String(state.bleScanCount)}
            unit="회"
            icon="tower-broadcast"
            tone="info"
          />
          <View style={styles.statDivider} />
          <StatCard
            bare
            style={styles.stat}
            title="번호 변경"
            value={String(state.phoneChangeCount)}
            unit="회"
            icon="arrows-rotate"
            tone="violet"
          />
        </View>
        <View style={styles.divider} />
        <GlassRow
          style={styles.last}
          icon="clock-rotate-left"
          iconVariant="glass"
          tone="success"
          title={`마지막 감지 · ${state.deviceName}`}
          subtitle={`${state.lastScanTime}분 전`}
          right={
            <StatusPill
              variant="plain"
              icon={batteryIcon(battery)}
              tone={batteryTone(battery)}
              label={`${battery}%`}
            />
          }
        />
      </GlassSurface>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  panel: {
    width: '100%',
    maxWidth: 360,
    marginHorizontal: 'auto',
    marginTop: 8,
    padding: 14,
    gap: 12,
  },
  stats: {
    flexDirection: 'row',
    gap: 14,
  },
  stat: {
    flex: 1,
  },
  // 두 통계 사이 세로 구분선
  statDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: GLASS.divider,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: GLASS.divider,
  },
  // 판 안쪽 여백에 맞춰 줄 좌우 여백은 없앤다
  last: {
    minHeight: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
})
