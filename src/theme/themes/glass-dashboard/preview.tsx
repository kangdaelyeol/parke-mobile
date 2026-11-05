import { StyleSheet, Text, View } from 'react-native'
import { AreaChart, StatusPill } from './components'
import {
  ACCENT_FILL,
  ACCENT_GLOW,
  CHART,
  glassStyles,
  TEXT,
  TONE,
} from './tokens'
import { PRETENDARD } from '@/theme/fonts'

// 미리보기 영역 차트 값 (오른쪽 위로 오르는 모양). 같은 배열을 넘겨 경로를 다시 그리지 않는다
const PREVIEW_SERIES = [
  { data: [3, 4.2, 3.6, 5.1, 4.7, 6.2, 5.6, 7.4], color: CHART.primary },
]
const TONES = [TONE.success, TONE.info, TONE.warning, TONE.violet]

// 글래스 대시보드 미리보기: 유리 판 + 숫자 + 상태 알약 + 빛나는 곡선 + 강조색 버튼
export const GlassDashboardPreview = () => (
  <View style={[glassStyles.inset, styles.preview]}>
    <View style={[glassStyles.surface, styles.miniPanel]}>
      <Text style={styles.miniLabel}>BLE 감지</Text>
      <Text style={styles.miniValue}>128</Text>
      <StatusPill tone="success" icon="arrow-trend-up" label="12%" />
    </View>
    <View style={[glassStyles.surface, styles.miniPanel, styles.grow]}>
      <View style={styles.toneRow}>
        {TONES.map(color => (
          <View
            key={color}
            style={[styles.toneDot, { backgroundColor: color }]}
          />
        ))}
      </View>
      <AreaChart series={PREVIEW_SERIES} height={34} dots={false} />
      <View style={styles.miniButton}>
        <Text style={styles.miniButtonText}>주행모드</Text>
      </View>
    </View>
  </View>
)

const styles = StyleSheet.create({
  preview: {
    flexDirection: 'row',
    gap: 8,
    padding: 8,
    borderRadius: 14,
  },
  miniPanel: {
    padding: 10,
    gap: 5,
    borderRadius: 12,
  },
  grow: {
    flex: 1,
    justifyContent: 'space-between',
  },
  miniLabel: {
    color: TEXT.secondary,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 10.5,
  },
  miniValue: {
    color: TEXT.primary,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 20,
    letterSpacing: -0.4,
  },
  toneRow: {
    flexDirection: 'row',
    gap: 5,
  },
  toneDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  miniButton: {
    height: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    borderTopColor: 'rgba(255,255,255,0.32)',
    experimental_backgroundImage: ACCENT_FILL,
    boxShadow: ACCENT_GLOW,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniButtonText: {
    color: TEXT.primary,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 11,
  },
})
