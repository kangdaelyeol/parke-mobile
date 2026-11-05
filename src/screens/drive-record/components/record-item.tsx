import { memo } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { IconTile } from '@/components'
import { DriveRecordItemProps } from '@/screens/drive-record/types'
import {
  formatClock,
  formatDateTime,
  formatDuration,
  formatKm,
  toKmh,
} from '@/utils'
import { GLASS, glassStyles, TEXT } from '@/theme/glass'
import { DM_MONO, PRETENDARD } from '@/theme/fonts'

// 주행 기록 한 줄: 카드 강조색 아이콘 타일 + 날짜/요약 + 오른쪽 거리 (영상의 보안 로그 줄)
export const RecordItem = memo(
  ({ record, accent, onPress }: DriveRecordItemProps) => (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View
          style={[
            glassStyles.surface,
            styles.container,
            pressed && styles.pressed,
          ]}
        >
          <IconTile icon="route" color={accent} size={36} />
          <View style={styles.info}>
            <Text style={styles.date} numberOfLines={1}>
              {formatDateTime(record.startAt)}
            </Text>
            <Text style={styles.sub} numberOfLines={1}>
              ~ {formatClock(record.endAt)} ·{' '}
              {formatDuration(record.endAt - record.startAt)} · 평균{' '}
              {toKmh(record.averageSpeed)}km/h
            </Text>
          </View>
          <View style={styles.distance}>
            <Text style={styles.distanceValue}>
              {formatKm(record.distance)}
            </Text>
            <Text style={styles.distanceUnit}>km</Text>
          </View>
        </View>
      )}
    </Pressable>
  ),
)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 18,
  },
  pressed: {
    backgroundColor: GLASS.fillActive,
    borderColor: GLASS.borderActive,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  date: {
    color: TEXT.strong,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 15,
  },
  sub: {
    color: TEXT.tertiary,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 12,
  },
  distance: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  distanceValue: {
    color: TEXT.primary,
    fontFamily: DM_MONO.MEDIUM,
    fontSize: 18,
  },
  distanceUnit: {
    color: TEXT.tertiary,
    fontFamily: DM_MONO.MEDIUM,
    fontSize: 12,
  },
})
