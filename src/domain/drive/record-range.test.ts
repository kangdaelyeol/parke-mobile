import { DriveRecordDto } from './drive-dto'
import { filterRecordsByRange, rangeStart, sumDistance } from './record-range'

const at = (year: number, month: number, day: number, hour = 0) =>
  new Date(year, month - 1, day, hour).getTime()

const record = (
  id: string,
  startAt: number,
  distance = 1000,
): DriveRecordDto => ({
  id,
  cardId: 'card',
  cardTitle: '내 차',
  startAt,
  endAt: startAt + 60_000,
  distance,
  averageSpeed: 10,
  maxSpeed: 20,
})

describe('rangeStart', () => {
  it('전체는 처음부터', () => {
    expect(rangeStart('all', at(2026, 11, 5, 15))).toBe(0)
  })

  it('이번 주는 그 주 월요일 0시부터', () => {
    // 2026-11-05 목요일 → 11-02 월요일
    expect(rangeStart('week', at(2026, 11, 5, 15))).toBe(at(2026, 11, 2))
    // 월요일 아침이면 그날 0시
    expect(rangeStart('week', at(2026, 11, 2, 8))).toBe(at(2026, 11, 2))
    // 일요일은 그 주의 마지막 날 (앞 월요일부터)
    expect(rangeStart('week', at(2026, 11, 8, 20))).toBe(at(2026, 11, 2))
    // 달이 바뀌는 주: 11-01 일요일 → 10-26 월요일
    expect(rangeStart('week', at(2026, 11, 1, 9))).toBe(at(2026, 10, 26))
  })

  it('이번 달은 1일 0시부터', () => {
    expect(rangeStart('month', at(2026, 11, 5, 15))).toBe(at(2026, 11, 1))
  })
})

describe('filterRecordsByRange', () => {
  const now = at(2026, 11, 5, 15)
  const records = [
    record('this-week', at(2026, 11, 3, 9)),
    record('monday-midnight', at(2026, 11, 2)),
    record('last-week', at(2026, 11, 1, 23)),
    record('last-month', at(2026, 10, 30, 9)),
  ]

  it('전체는 그대로 돌려준다', () => {
    expect(filterRecordsByRange(records, 'all', now)).toBe(records)
  })

  it('기간 시작 시각에 시작한 기록도 포함한다', () => {
    expect(filterRecordsByRange(records, 'week', now).map(r => r.id)).toEqual([
      'this-week',
      'monday-midnight',
    ])
    expect(filterRecordsByRange(records, 'month', now).map(r => r.id)).toEqual([
      'this-week',
      'monday-midnight',
      'last-week',
    ])
  })
})

describe('sumDistance', () => {
  it('거리(m)를 더한다', () => {
    expect(sumDistance([])).toBe(0)
    expect(sumDistance([record('a', 0, 1200), record('b', 0, 300)])).toBe(1500)
  })
})
