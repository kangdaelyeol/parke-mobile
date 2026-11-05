import { useMemo, useState } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { RouteProp } from '@react-navigation/native'
import {
  FilterChips,
  GlassScreen,
  GlassTableColumn,
  GlassTableHeader,
  GlassTableRow,
  IconTile,
  PanelHeader,
  SegmentOption,
} from '@/components'
import { DriveRecordDto } from '@/domain/drive'
import { RootStackParamList } from '@/navigation/types'
import { useDriveRecordsViewModel } from '@/screens/drive-record/view-model'
import { formatClock, formatDay, formatKm, formatMinutes } from '@/utils'
import { DM_MONO, PRETENDARD } from '@/theme/fonts'
import { glassStyles, TEXT } from '@/theme/glass'

type DriveRecordsScreenProps = {
  route: RouteProp<RootStackParamList, 'DriveRecords'>
}

type RecordRange = 'all' | 'week' | 'month'

const RANGES: readonly SegmentOption<RecordRange>[] = [
  { key: 'all', label: '전체' },
  { key: 'week', label: '이번 주' },
  { key: 'month', label: '이번 달' },
]

// 기간의 시작 시각 (이번 주는 월요일 0시부터, 이번 달은 1일 0시부터)
const rangeStart = (range: RecordRange) => {
  const now = new Date()
  if (range === 'month')
    return new Date(now.getFullYear(), now.getMonth(), 1).getTime()
  const fromMonday = (now.getDay() + 6) % 7
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - fromMonday,
  ).getTime()
}

// 카드별 주행 기록 목록 (글래스): 영상의 최근 기록 표처럼 판 하나에 제목 · 필터 칩 · 머리줄 · 줄.
// 기록이 많아도 보이는 줄만 그리도록 줄은 FlatList로 그리고, 판 안에서 스크롤한다
export function GlassDriveRecordsScreen({ route }: DriveRecordsScreenProps) {
  const { state, actions } = useDriveRecordsViewModel(route.params.cardId)
  const [range, setRange] = useState<RecordRange>('all')

  const records = useMemo(() => {
    if (range === 'all') return state.records
    const from = rangeStart(range)
    return state.records.filter(record => record.startAt >= from)
  }, [state.records, range])
  const totalKm = formatKm(records.reduce((sum, r) => sum + r.distance, 0))

  const columns = useMemo<GlassTableColumn<DriveRecordDto>[]>(
    () => [
      {
        key: 'date',
        title: '날짜',
        flex: 2.2,
        render: record => (
          <View style={styles.dateCell}>
            <IconTile icon="route" color={state.accent} size={30} />
            <View style={styles.dateTexts}>
              <Text style={styles.date} numberOfLines={1}>
                {formatDay(record.startAt)}
              </Text>
              <Text style={styles.time} numberOfLines={1}>
                {formatClock(record.startAt)} ~ {formatClock(record.endAt)}
              </Text>
            </View>
          </View>
        ),
      },
      {
        key: 'distance',
        title: '거리',
        align: 'right',
        render: record => (
          <Text style={styles.distance} numberOfLines={1}>
            {formatKm(record.distance)}
            <Text style={styles.unit}> km</Text>
          </Text>
        ),
      },
      {
        key: 'duration',
        title: '시간',
        align: 'right',
        render: record => formatMinutes(record.endAt - record.startAt),
      },
    ],
    [state.accent],
  )

  return (
    <GlassScreen
      title={state.cardTitle || '주행 기록'}
      onBack={actions.backPress}
      loading={state.loading}
    >
      <View style={[glassStyles.surface, styles.panel]}>
        <PanelHeader
          title="주행 기록"
          subtitle={`${records.length}건 · ${totalKm}km`}
          right={
            <FilterChips options={RANGES} value={range} onChange={setRange} />
          }
        />
        <View style={styles.table}>
          <GlassTableHeader columns={columns} />
          <FlatList
            style={styles.list}
            data={records}
            keyExtractor={record => record.id}
            renderItem={({ item }) => (
              <GlassTableRow
                columns={columns}
                row={item}
                onPress={actions.recordPress}
              />
            )}
            ListEmptyComponent={
              <Text style={styles.empty}>
                {state.records.length
                  ? '이 기간에는 주행 기록이 없어요.'
                  : '아직 주행 기록이 없어요.\n주행 모드를 끝내면 여기에 저장됩니다.'}
              </Text>
            }
          />
        </View>
      </View>
    </GlassScreen>
  )
}

const styles = StyleSheet.create({
  // 줄이 적으면 내용만큼, 많으면 화면 아래까지 늘어나고 안에서 스크롤한다
  panel: {
    flexShrink: 1,
    padding: 16,
    paddingBottom: 6,
    gap: 14,
  },
  table: {
    flexShrink: 1,
  },
  list: {
    flexGrow: 0,
    flexShrink: 1,
  },
  dateCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dateTexts: {
    flexShrink: 1,
    gap: 3,
  },
  date: {
    color: TEXT.strong,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 14,
  },
  time: {
    color: TEXT.tertiary,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 12,
  },
  distance: {
    color: TEXT.primary,
    fontFamily: DM_MONO.MEDIUM,
    fontSize: 14,
  },
  unit: {
    color: TEXT.tertiary,
    fontSize: 11,
  },
  empty: {
    paddingVertical: 36,
    color: TEXT.tertiary,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 13,
    lineHeight: 21,
    textAlign: 'center',
  },
})
