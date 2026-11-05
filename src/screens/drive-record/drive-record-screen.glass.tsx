import { StyleSheet, Text, View } from 'react-native'
import { RouteProp } from '@react-navigation/native'
import {
  GlassScreen,
  PanelHeader,
  PressableButton,
  StatCard,
} from '@/components'
import { RootStackParamList } from '@/navigation/types'
import { DriveMap } from '@/screens/drive/components'
import { MAP_PIN_COLORS } from '@/screens/drive/map-html'
import { useDriveRecordViewModel } from '@/screens/drive-record/view-model'
import {
  formatClock,
  formatDay,
  formatDuration,
  formatKm,
  toKmh,
} from '@/utils'
import { PRETENDARD } from '@/theme/fonts'
import { glassStyles, TEXT } from '@/theme/glass'

type DriveRecordScreenProps = {
  route: RouteProp<RootStackParamList, 'DriveRecord'>
}

// 주행 기록 상세 (글래스): 영상 Analytics처럼 위에 통계 카드 네 장, 아래에 큰 판(경로 지도 + 범례 줄)
export function GlassDriveRecordScreen({ route }: DriveRecordScreenProps) {
  const { state, actions } = useDriveRecordViewModel(route.params.record)
  const { record } = state

  return (
    <GlassScreen
      title={record.cardTitle}
      onBack={actions.backPress}
      bodyStyle={styles.body}
    >
      <View style={styles.statRow}>
        <StatCard
          style={styles.stat}
          title="이동 거리"
          value={formatKm(record.distance)}
          unit="km"
          icon="route"
          tone="info"
        />
        <StatCard
          style={styles.stat}
          title="주행 시간"
          value={formatDuration(record.endAt - record.startAt)}
          icon="stopwatch"
          tone="violet"
        />
      </View>
      <View style={styles.statRow}>
        <StatCard
          style={styles.stat}
          title="평균 속도"
          value={String(toKmh(record.averageSpeed))}
          unit="km/h"
          icon="gauge-high"
          tone="success"
        />
        <StatCard
          style={styles.stat}
          title="최고 속도"
          value={String(toKmh(record.maxSpeed))}
          unit="km/h"
          icon="bolt"
          tone="warning"
        />
      </View>

      {/* 경로 판: 머리줄(날짜 · 시각) + 지도 + 아래 범례 줄 (영상 큰 차트 판의 아래 범례처럼) */}
      <View style={[glassStyles.surface, styles.mapPanel]}>
        <PanelHeader
          title="주행 경로"
          subtitle={`${formatDay(record.startAt)} · ${formatClock(
            record.startAt,
          )} ~ ${formatClock(record.endAt)}`}
        />
        <View style={styles.map}>
          <DriveMap
            ref={state.mapRef}
            phase="summary"
            points={state.points}
            current={null}
            accent={state.accent}
          />
          {state.loading && (
            <View style={styles.loading}>
              <Text style={styles.loadingText}>경로를 불러오는 중…</Text>
            </View>
          )}
        </View>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.startDot]} />
            <Text style={styles.legendText}>출발</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.endDot]} />
            <Text style={styles.legendText}>도착</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendLine, { backgroundColor: state.accent }]}
            />
            <Text style={styles.legendText}>경로</Text>
          </View>
        </View>
      </View>

      <PressableButton
        variant="danger"
        title={state.deleting ? '삭제 중…' : '기록 삭제'}
        onPress={actions.deletePress}
      />
    </GlassScreen>
  )
}

const styles = StyleSheet.create({
  body: {
    gap: 10,
  },
  statRow: {
    flexDirection: 'row',
    gap: 10,
  },
  stat: {
    flex: 1,
  },
  // 남은 높이를 모두 쓰는 큰 판 (지도가 늘어난다)
  mapPanel: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  map: {
    flex: 1,
    minHeight: 140,
    borderRadius: 14,
    overflow: 'hidden',
  },
  loading: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    backgroundColor: 'rgba(16,16,18,0.88)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  loadingText: {
    color: TEXT.secondary,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 13,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  startDot: {
    backgroundColor: MAP_PIN_COLORS.start,
  },
  endDot: {
    backgroundColor: MAP_PIN_COLORS.end,
  },
  legendLine: {
    width: 14,
    height: 3,
    borderRadius: 2,
  },
  legendText: {
    color: TEXT.tertiary,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 12,
  },
})
