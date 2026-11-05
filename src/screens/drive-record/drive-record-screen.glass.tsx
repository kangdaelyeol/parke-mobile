import { Pressable, StyleSheet, Text, View } from 'react-native'
import { RouteProp } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import { PressableButton, StatCard } from '@/components'
import { RootStackParamList } from '@/navigation/types'
import { DriveMap } from '@/screens/drive/components'
import { useDriveRecordViewModel } from '@/screens/drive-record/view-model'
import {
  formatClock,
  formatDateTime,
  formatDuration,
  formatKm,
  toKmh,
} from '@/utils'
import { DM_SANS, PRETENDARD } from '@/theme/fonts'
import { GLASS, TEXT } from '@/theme/glass'

type DriveRecordScreenProps = {
  route: RouteProp<RootStackParamList, 'DriveRecord'>
}

// 주행 기록 상세 (글래스): 경로 지도 + 통계 카드 네 장
export function GlassDriveRecordScreen({ route }: DriveRecordScreenProps) {
  const { state, actions } = useDriveRecordViewModel(route.params.record)
  const { top, bottom } = useSafeAreaInsets()
  const { record } = state

  return (
    <View style={styles.container}>
      <View style={styles.map}>
        <DriveMap
          ref={state.mapRef}
          phase="summary"
          points={state.points}
          current={null}
          accent={state.accent}
        />
        <Pressable
          onPress={actions.backPress}
          style={[styles.backChip, { top: top + 10 }]}
          hitSlop={8}
        >
          <FontAwesome6
            name="angle-left"
            iconStyle="solid"
            size={16}
            color={TEXT.primary}
          />
          <Text style={styles.backText}>{record.cardTitle}</Text>
        </Pressable>
        {state.loading && (
          <View style={styles.loading}>
            <Text style={styles.loadingText}>경로를 불러오는 중…</Text>
          </View>
        )}
      </View>
      <View style={[styles.panel, { paddingBottom: bottom + 16 }]}>
        <View style={styles.header}>
          <Text style={styles.title}>{formatDateTime(record.startAt)}</Text>
          <Text style={styles.subTitle}>
            {formatClock(record.startAt)} ~ {formatClock(record.endAt)}
          </Text>
        </View>
        {/* 요약 4칸 (영상 상단의 통계 카드 네 장) */}
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
        <PressableButton
          variant="danger"
          title={state.deleting ? '삭제 중…' : '기록 삭제'}
          onPress={actions.deletePress}
        />
      </View>
    </View>
  )
}

// 지도 위에 뜨는 요소는 뒤 지도에 묻히지 않도록 짙은 유리
const MAP_GLASS = 'rgba(16,16,18,0.88)'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  map: {
    flex: 1,
  },
  backChip: {
    position: 'absolute',
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: MAP_GLASS,
    borderWidth: 1,
    borderColor: GLASS.border,
    borderTopColor: GLASS.highlight,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  backText: {
    color: TEXT.primary,
    fontFamily: DM_SANS.BOLD,
    fontSize: 14,
  },
  loading: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    backgroundColor: MAP_GLASS,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  loadingText: {
    color: TEXT.secondary,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 13,
  },
  // 지도 아래 판: 위쪽 테두리만 밝은 유리
  panel: {
    backgroundColor: '#0c0c0e',
    experimental_backgroundImage: GLASS.sheen,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: GLASS.highlight,
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 10,
  },
  header: {
    gap: 4,
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  title: {
    color: TEXT.primary,
    fontFamily: DM_SANS.BOLD,
    fontSize: 20,
  },
  subTitle: {
    color: TEXT.tertiary,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 13,
  },
  statRow: {
    flexDirection: 'row',
    gap: 10,
  },
  stat: {
    flex: 1,
  },
})
