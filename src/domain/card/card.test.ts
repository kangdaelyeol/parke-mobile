import { Card, DEFAULT_CARD_CUSTOM } from './card'

// 네이티브 모듈은 테스트에서 쓸 수 없어 서버 시각 자리만 흉내 낸다
jest.mock('@react-native-firebase/database', () => ({
  serverTimestamp: () => ({ '.sv': 'timestamp' }),
}))

const base = {
  id: 'card-1',
  title: '내 차',
  phone: '01012345678',
  updatedAt: 1,
  deviceId: 'device-1',
  ownerList: ['user-1'],
}

describe('Card', () => {
  it('스키마 변경 전 카드(custom 없음, message가 최상위)를 지금 형태로 맞춘다', () => {
    const dto = Card.create({
      ...base,
      title: '  내 차 ',
      message: '안녕',
    }).toDto()
    expect(dto.title).toBe('내 차')
    expect(dto.theme).toBe('dark')
    expect(dto.layout).toBe('a')
    expect(dto.custom).toEqual({ ...DEFAULT_CARD_CUSTOM, message: '안녕' })
  })

  it('custom.message가 있으면 최상위 message보다 먼저 쓴다', () => {
    const dto = Card.create({
      ...base,
      message: '옛 메시지',
      custom: { message: '새 메시지' },
    }).toDto()
    expect(dto.custom.message).toBe('새 메시지')
  })

  it('모르는 테마·레이아웃·잘못된 강조색은 기본값으로', () => {
    const dto = Card.fromDto({
      ...base,
      theme: 'neon' as never,
      layout: 'z' as never,
      custom: { accent: 'blue', scale: 1, message: '' },
    }).toDto()
    expect(dto.theme).toBe('dark')
    expect(dto.layout).toBe('a')
    expect(dto.custom.accent).toBe(DEFAULT_CARD_CUSTOM.accent)
  })

  it('크기 배율은 0.85~1.3 안으로, 메시지는 40자까지', () => {
    const big = Card.create({ ...base, custom: { scale: 5 } }).toDto()
    const small = Card.create({ ...base, custom: { scale: 0.1 } }).toDto()
    const long = Card.create({
      ...base,
      custom: { message: '가'.repeat(50) },
    }).toDto()
    expect(big.custom.scale).toBe(1.3)
    expect(small.custom.scale).toBe(0.85)
    expect(long.custom.message).toHaveLength(40)
  })

  it('updatedAt이 없으면 서버 시각으로 채운다', () => {
    const dto = Card.create({ ...base, updatedAt: undefined }).toDto()
    expect(dto.updatedAt).toEqual({ '.sv': 'timestamp' })
  })
})
