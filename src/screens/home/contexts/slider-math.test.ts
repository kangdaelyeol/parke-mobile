import { EDGE_RESISTANCE, resistEdges, snapIndex } from './slider-math'

describe('resistEdges', () => {
  const minX = -600 // 마지막 칸 위치 (칸 3개, 간격 300)

  it('칸 사이에서는 손가락을 그대로 따라간다', () => {
    expect(resistEdges(0, minX)).toBe(0)
    expect(resistEdges(-250, minX)).toBe(-250)
    expect(resistEdges(minX, minX)).toBe(minX)
  })

  it('첫 칸보다 오른쪽, 마지막 칸보다 왼쪽은 덜 따라간다', () => {
    expect(resistEdges(100, minX)).toBeCloseTo(100 * EDGE_RESISTANCE)
    expect(resistEdges(minX - 100, minX)).toBeCloseTo(
      minX - 100 * EDGE_RESISTANCE,
    )
  })
})

describe('snapIndex', () => {
  it('천천히 놓으면 가까운 칸', () => {
    expect(snapIndex(0.4, 0, 3)).toBe(0)
    expect(snapIndex(0.6, 0, 3)).toBe(1)
  })

  it('빠르게 밀면 조금만 움직여도 민 방향의 칸', () => {
    // 왼쪽으로 밀면(음수) 다음 칸
    expect(snapIndex(0.1, -800, 3)).toBe(1)
    // 오른쪽으로 밀면 앞 칸
    expect(snapIndex(1.9, 800, 3)).toBe(1)
  })

  it('처음과 마지막 칸을 넘지 않는다', () => {
    expect(snapIndex(-0.3, 800, 3)).toBe(0)
    expect(snapIndex(3.2, -800, 3)).toBe(3)
  })
})
