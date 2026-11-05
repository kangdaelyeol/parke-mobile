import { StyleSheet, View } from 'react-native'
import { SolidIconName, StatCard } from '@/components'
import { Tone } from '@/theme/glass'
import { useTodaySummaryViewModel } from '@home/view-model'

const batteryIcon = (level: number): SolidIconName => {
  if (level >= 80) return 'battery-full'
  if (level >= 60) return 'battery-three-quarters'
  if (level >= 35) return 'battery-half'
  if (level >= 10) return 'battery-quarter'
  return 'battery-empty'
}

const batteryState = (level: number): { label: string; tone: Tone } => {
  if (level >= 50) return { label: '양호', tone: 'success' }
  if (level >= 20) return { label: '보통', tone: 'warning' }
  return { label: '부족', tone: 'danger' }
}

// 지난 시간(분)을 큰 숫자 + 단위로 (방금 / n분 전 / n시간 전 / n일 전)
const elapsed = (minutes: number): { value: string; unit?: string } => {
  if (minutes < 1) return { value: '방금' }
  if (minutes < 60) return { value: String(minutes), unit: '분 전' }
  if (minutes < 60 * 24)
    return { value: String(Math.floor(minutes / 60)), unit: '시간 전' }
  return { value: String(Math.floor(minutes / (60 * 24))), unit: '일 전' }
}

// 오늘의 현황 (글래스): 영상 맨 위 통계 카드 줄처럼 카드 네 장을 2×2로 놓는다
export const GlassTodaySummary = () => {
  const { state } = useTodaySummaryViewModel()
  // 아직 한 번도 감지하지 않았으면 배터리·마지막 감지는 비워 둔다
  const hasScan = !!state.deviceName
  const battery = Number(state.batteryLevel) || 0
  const last = elapsed(state.lastScanTime)

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
            tone={batteryState(battery).tone}
            badge={batteryState(battery)}
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
