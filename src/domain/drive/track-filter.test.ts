import { evaluateFix, GpsFix, MAX_ACCURACY_M, TrackPoint } from './track-filter'

// 위도 1e-5도 ≈ 1.11m. 북쪽으로 meters만큼 떨어진 위도
const BASE_LAT = 37.5
const north = (meters: number) => BASE_LAT + meters / 111_195

const fix = (over: Partial<GpsFix> = {}): GpsFix => ({
  latitude: BASE_LAT,
  longitude: 127,
  accuracy: 5,
  speed: null,
  timestamp: 0,
  ...over,
})

const anchorAt = (over: Partial<TrackPoint> = {}): TrackPoint => ({
  latitude: BASE_LAT,
  longitude: 127,
  timestamp: 0,
  speed: null,
  accuracy: 5,
  ...over,
})

describe('evaluateFix', () => {
  it('정확도가 기준보다 나쁘면 버린다 (기준값은 통과)', () => {
    expect(evaluateFix(null, fix({ accuracy: MAX_ACCURACY_M + 1 }))).toEqual({
      type: 'inaccurate',
    })
    expect(evaluateFix(null, fix({ accuracy: MAX_ACCURACY_M })).type).toBe(
      'first',
    )
  })

  it('첫 위치는 기준점이 되고, 기기 속도가 없으면 0으로 시작한다', () => {
    const noSpeed = evaluateFix(null, fix({ speed: -1 }))
    expect(noSpeed).toMatchObject({ type: 'first', speed: 0 })
    expect(noSpeed.type === 'first' && noSpeed.point.speed).toBeNull()
    expect(evaluateFix(null, fix({ speed: 3 }))).toMatchObject({
      type: 'first',
      speed: 3,
    })
  })

  it('기준점에서 덜 움직이면 흔들림 (기준 거리는 두 정확도의 평균, 8~25m)', () => {
    // 평균 정확도 10m → 기준 10m
    const anchor = anchorAt({ accuracy: 10 })
    const near = fix({ latitude: north(9), accuracy: 10, timestamp: 3000 })
    expect(evaluateFix(anchor, near)).toMatchObject({
      type: 'jitter',
      threshold: 10,
    })
    // 정확도가 아주 좋아도 8m는 움직여야 한다
    const sharp = anchorAt({ accuracy: 2 })
    expect(
      evaluateFix(sharp, fix({ latitude: north(7), accuracy: 2 })).type,
    ).toBe('jitter')
    // 정확도가 나빠도 기준은 25m를 넘지 않는다
    const blurry = anchorAt({ accuracy: 45 })
    const far = fix({ latitude: north(26), accuracy: 45, timestamp: 3000 })
    expect(evaluateFix(blurry, far)).toMatchObject({ type: 'accepted' })
  })

  it('흔들림이어도 기기 속도는 넘겨준다', () => {
    const result = evaluateFix(
      anchorAt(),
      fix({ latitude: north(3), speed: 4 }),
    )
    expect(result).toMatchObject({ type: 'jitter', speed: 4 })
  })

  it('너무 빠른 이동(약 250km/h 초과)은 GPS 튐으로 버린다', () => {
    const result = evaluateFix(
      anchorAt(),
      fix({ latitude: north(100), timestamp: 1000 }),
    )
    expect(result).toMatchObject({ type: 'jump', seconds: 1 })
  })

  it('이동으로 인정하면 거리와 속도를 준다 (기기 속도 → 2초 이상이면 직접 계산)', () => {
    const computed = evaluateFix(
      anchorAt(),
      fix({ latitude: north(30), timestamp: 3000 }),
    )
    expect(computed.type).toBe('accepted')
    if (computed.type !== 'accepted') return
    expect(computed.meters).toBeCloseTo(30, 0)
    expect(computed.speed).toBeCloseTo(10, 0)

    // 2초가 안 되면 직접 계산한 속도는 튀므로 쓰지 않는다
    const tooQuick = evaluateFix(
      anchorAt(),
      fix({ latitude: north(30), timestamp: 1000 }),
    )
    expect(tooQuick).toMatchObject({ type: 'accepted', speed: null })

    // 기기 속도가 있으면 그 값을 쓴다
    const native = evaluateFix(
      anchorAt(),
      fix({ latitude: north(30), timestamp: 3000, speed: 12 }),
    )
    expect(native).toMatchObject({ type: 'accepted', speed: 12 })
  })

  it('같은 시각에 받은 위치는 튐 판정 없이 인정하되 속도는 모른다', () => {
    const result = evaluateFix(
      anchorAt(),
      fix({ latitude: north(40), timestamp: 0 }),
    )
    expect(result).toMatchObject({ type: 'accepted', seconds: 0, speed: null })
  })
})
