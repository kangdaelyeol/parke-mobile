import { formatElapsed } from './format-elapsed'

describe('formatElapsed', () => {
  it('1분이 안 되면 방금', () => {
    expect(formatElapsed(0)).toEqual({ value: '방금' })
  })

  it('한 시간 안은 분, 하루 안은 시간, 그 뒤로는 일', () => {
    expect(formatElapsed(1)).toEqual({ value: '1', unit: '분 전' })
    expect(formatElapsed(59)).toEqual({ value: '59', unit: '분 전' })
    expect(formatElapsed(60)).toEqual({ value: '1', unit: '시간 전' })
    expect(formatElapsed(1439)).toEqual({ value: '23', unit: '시간 전' })
    expect(formatElapsed(1440)).toEqual({ value: '1', unit: '일 전' })
    expect(formatElapsed(4000)).toEqual({ value: '2', unit: '일 전' })
  })
})
