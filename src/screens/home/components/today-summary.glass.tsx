import { StyleSheet, View } from 'react-native'
import { SolidIconName, StatCard } from '@/components'
import { BatteryStatus, batteryStatus } from '@/domain/card'
import { Tone } from '@/theme/glass'
import { useTodaySummaryViewModel } from '@home/view-model'
import { formatElapsed } from '@/utils'

const batteryIcon = (level: number): SolidIconName => {
  if (level >= 80) return 'battery-full'
  if (level >= 60) return 'battery-three-quarters'
  if (level >= 35) return 'battery-half'
  if (level >= 10) return 'battery-quarter'
  return 'battery-empty'
}

const BATTERY_BADGE: Record<BatteryStatus, { label: string; tone: Tone }> = {
  good: { label: '양호', tone: 'success' },
  fair: { label: '보통', tone: 'warning' },
  low: { label: '부족', tone: 'danger' },
}

// 오늘의 현황 (글래스): 영상 맨 위 통계 카드 줄처럼 카드 네 장을 2×2로 놓는다
export const GlassTodaySummary = () => {
  const { state } = useTodaySummaryViewModel()
  // 아직 한 번도 감지하지 않았으면 배터리·마지막 감지는 비워 둔다
  const hasScan = !!state.deviceName
  const battery = Number(state.batteryLevel) || 0
  const last = formatElapsed(state.lastScanTime)
  const batteryBadge = BATTERY_BADGE[batteryStatus(battery)]

  return (
    <View style={styles.grid}>
      <View style={styles.row}>
        <StatCard
          style={styles.stat}
          title="오늘 BLE 감지"
          value={String(state.bleScanCount)}
          unit="회"
          icon="tower-broadcast"
          tone="info"
        />
        <StatCard
          style={styles.stat}
          title="오늘 번호 변경"
          value={String(state.phoneChangeCount)}
          unit="회"
          icon="arrows-rotate"
          tone="violet"
        />
      </View>
      <View style={styles.row}>
        {hasScan ? (
          <StatCard
            style={styles.stat}
            title="배터리"
            value={String(battery)}
            unit="%"
            icon={batteryIcon(battery)}
            tone={batteryBadge.tone}
            badge={batteryBadge}
          />
        ) : (
          <StatCard
            style={styles.stat}
            title="배터리"
            value="-"
            icon="battery-empty"
            tone="neutral"
            caption="감지 기록 없음"
          />
        )}
        <StatCard
          style={styles.stat}
          title="마지막 감지"
          value={hasScan ? last.value : '-'}
          unit={hasScan ? last.unit : undefined}
          icon="clock-rotate-left"
          tone="success"
          caption={hasScan ? state.deviceName : '감지 기록 없음'}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  grid: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  stat: {
    flex: 1,
  },
})
