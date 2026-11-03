import { Pressable, StyleSheet, Text, View } from 'react-native'
import { RouteProp } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import { PressableButton } from '@/components'
import { RootStackParamList } from '@/navigation/types'
import { DriveMap, DriveStat } from '@/screens/drive/components'
import { useDriveRecordViewModel } from '@/screens/drive-record/view-model'
import {
  formatClock,
  formatDateTime,
  formatDuration,
  formatKm,
  toKmh,
} from '@/utils'
import { DARK, DARK_LIGHT, GRAY, WHITE } from '@/theme/color'
import { DM_SANS, PRETENDARD } from '@/theme/fonts'

type DriveRecordScreenProps = {
  route: RouteProp<RootStackParamList, 'DriveRecord'>
}

// 주행 기록 상세: 경로 지도 + 요약
export default function DriveRecordScreen({ route }: DriveRecordScreenProps) {
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
            color={WHITE}
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
        <View style={styles.statRow}>
          <DriveStat
            label="이동 거리"
            value={formatKm(record.distance)}
            unit="km"
          />
          <DriveStat
            label="주행 시간"
            value={formatDuration(record.endAt - record.startAt)}
          />
        </View>
        <View style={styles.statRow}>
          <DriveStat
            label="평균 속도"
            value={String(toKmh(record.averageSpeed))}
            unit="km/h"
          />
          <DriveStat
            label="최고 속도"
            value={String(toKmh(record.maxSpeed))}
            unit="km/h"
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
    backgroundColor: DARK,
    borderWidth: 1,
    borderColor: DARK_LIGHT,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  backText: {
    color: WHITE,
    fontFamily: DM_SANS.BOLD,
    fontSize: 14,
  },
  loading: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    backgroundColor: DARK,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  loadingText: {
    color: GRAY,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 13,
  },
  panel: {
    backgroundColor: DARK,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: DARK_LIGHT,
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 18,
  },
  header: {
    gap: 4,
  },
  title: {
    color: WHITE,
    fontFamily: DM_SANS.BOLD,
    fontSize: 20,
  },
  subTitle: {
    color: GRAY,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 13,
  },
  statRow: {
    flexDirection: 'row',
    gap: 16,
  },
})
