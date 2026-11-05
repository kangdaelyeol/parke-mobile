import { Pressable, StyleSheet, Text, View } from 'react-native'
import { DriveRecordItemProps } from '@/screens/drive-record/types'
import {
  formatClock,
  formatDateTime,
  formatDuration,
  formatKm,
  toKmh,
} from '@/utils'
import { DARK, DARK_LIGHT, GRAY, GRAY_DEEP, WHITE } from '@/theme/color'
import { DM_MONO, PRETENDARD } from '@/theme/fonts'

// 주행 기록 한 줄 (기본 테마: 처음 디자인, 왼쪽 카드 색 막대)
export const ClassicRecordItem = ({
  record,
  accent,
  onPress,
}: DriveRecordItemProps) => (
  <Pressable onPress={onPress}>
    {({ pressed }) => (
      <View style={[styles.container, pressed && styles.pressed]}>
        <View style={[styles.bar, { backgroundColor: accent }]} />
        <View style={styles.info}>
          <Text style={styles.date}>{formatDateTime(record.startAt)}</Text>
          <Text style={styles.sub}>
            ~ {formatClock(record.endAt)} ·{' '}
            {formatDuration(record.endAt - record.startAt)} · 평균{' '}
            {toKmh(record.averageSpeed)}km/h
          </Text>
        </View>
        <View style={styles.distance}>
          <Text style={styles.distanceValue}>{formatKm(record.distance)}</Text>
          <Text style={styles.distanceUnit}>km</Text>
        </View>
      </View>
    )}
  </Pressable>
)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: DARK,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: DARK_LIGHT,
  },
  pressed: {
    borderColor: GRAY_DEEP,
  },
  bar: {
    width: 4,
    alignSelf: 'stretch',
    borderRadius: 2,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  date: {
    color: WHITE,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 15,
  },
  sub: {
    color: GRAY,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 12,
  },
  distance: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  distanceValue: {
    color: WHITE,
    fontFamily: DM_MONO.MEDIUM,
    fontSize: 18,
  },
  distanceUnit: {
    color: GRAY,
    fontFamily: DM_MONO.MEDIUM,
    fontSize: 12,
  },
})
