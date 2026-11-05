import {
  formatClock,
  formatDay,
  formatDuration,
  formatKm,
  formatMinutes,
  toKmh,
} from './format-drive'

// 기기 시간대 기준 시각 (어느 시간대에서 돌려도 결과가 같게)
const at = (year: number, month: number, day: number, hour = 0, min = 0) =>
  new Date(year, month - 1, day, hour, min).getTime()

describe('formatDuration', () => {
  it('시:분:초를 두 자리씩 채운다', () => {
    expect(formatDuration(0)).toBe('00:00:00')
    expect(formatDuration(3_725_000)).toBe('01:02:05')
  })

  it('음수는 0으로 본다', () => {
    expect(formatDuration(-5000)).toBe('00:00:00')
  })
})

describe('formatClock', () => {
  it('24시간제 HH:MM', () => {
    expect(formatClock(at(2026, 11, 5, 9, 5))).toBe('09:05')
    expect(formatClock(at(2026, 11, 5, 21, 40))).toBe('21:40')
  })
})

describe('formatKm', () => {
  it('10km 미만은 소수점 두 자리, 이상은 한 자리', () => {
    expect(formatKm(1234)).toBe('1.23')
    expect(formatKm(12345)).toBe('12.3')
  })
})

describe('toKmh', () => {
  it('m/s를 km/h로 바꿔 반올림한다', () => {
    expect(toKmh(10)).toBe(36)
    expect(toKmh(0)).toBe(0)
  })
})

describe('formatDay', () => {
  const now = at(2026, 11, 5, 12)

  it('올해 기록은 월·일·요일만', () => {
    expect(formatDay(at(2026, 10, 22, 14), now)).toBe('10월 22일 (목)')
  })

  it('다른 해 기록은 앞에 연도를 붙인다', () => {
    expect(formatDay(at(2025, 12, 31, 23), now)).toBe('2025년 12월 31일 (수)')
  })
})

describe('formatMinutes', () => {
  it('1분이 안 되면 1분 미만', () => {
    expect(formatMinutes(0)).toBe('1분 미만')
    expect(formatMinutes(59_999)).toBe('1분 미만')
    expect(formatMinutes(-1000)).toBe('1분 미만')
  })

  it('시간이 없으면 분만, 분이 없으면 시간만', () => {
    expect(formatMinutes(60_000)).toBe('1분')
    expect(formatMinutes(32 * 60_000)).toBe('32분')
    expect(formatMinutes(65 * 60_000)).toBe('1시간 5분')
    expect(formatMinutes(120 * 60_000)).toBe('2시간')
  })
})
