import { DriveRecordDto } from './drive-dto'

// 주행 기록 기간 보기: 전체 / 이번 주(월요일 0시부터) / 이번 달(1일 0시부터)
export type RecordRange = 'all' | 'week' | 'month'

// 기간이 시작되는 시각 (기기 시간대 기준). 전체는 0
export const rangeStart = (range: RecordRange, now = Date.now()) => {
  if (range === 'all') return 0
  const date = new Date(now)
  if (range === 'month')
    return new Date(date.getFullYear(), date.getMonth(), 1).getTime()
  const fromMonday = (date.getDay() + 6) % 7
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - fromMonday,
  ).getTime()
}

// 기간 안에 시작한 기록만
export const filterRecordsByRange = (
  records: DriveRecordDto[],
  range: RecordRange,
  now = Date.now(),
) => {
  if (range === 'all') return records
  const from = rangeStart(range, now)
  return records.filter(record => record.startAt >= from)
}

// 거리 합계 (m)
export const sumDistance = (records: DriveRecordDto[]) =>
  records.reduce((sum, record) => sum + record.distance, 0)
