import { toDateKey } from './date-key'

describe('toDateKey', () => {
  it('기기 시간대 기준 YYYY-MM-DD', () => {
    expect(toDateKey(new Date(2026, 0, 5, 12).getTime())).toBe('2026-01-05')
  })

  it('자정 직후와 자정 직전은 그날 날짜다', () => {
    expect(toDateKey(new Date(2026, 10, 5, 0, 1).getTime())).toBe('2026-11-05')
    expect(toDateKey(new Date(2026, 10, 5, 23, 59).getTime())).toBe(
      '2026-11-05',
    )
  })
})
