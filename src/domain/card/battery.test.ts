import { batteryStatus } from './battery'

describe('batteryStatus', () => {
  it('50% 이상 양호, 20% 이상 보통, 그 아래 부족', () => {
    expect(batteryStatus(100)).toBe('good')
    expect(batteryStatus(50)).toBe('good')
    expect(batteryStatus(49)).toBe('fair')
    expect(batteryStatus(20)).toBe('fair')
    expect(batteryStatus(19)).toBe('low')
    expect(batteryStatus(0)).toBe('low')
  })
})
