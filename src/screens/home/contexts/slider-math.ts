// 카드 슬라이더 계산. 제스처 worklet 안에서 부르므로 함수마다 'worklet'을 둔다

// 이보다 빠르게 밀면(px/s) 거리가 짧아도 민 방향으로 한 칸 넘긴다
export const FLING_VELOCITY = 500
// 처음/마지막 칸에서 더 밀면 손가락을 이 비율만큼만 따라간다
export const EDGE_RESISTANCE = 0.3

// 끄는 중인 위치 x (px, 첫 칸 0, 왼쪽으로 넘길수록 음수, 마지막 칸 minX).
// 첫 칸보다 오른쪽, 마지막 칸보다 왼쪽은 덜 따라간다
export const resistEdges = (x: number, minX: number) => {
  'worklet'
  if (x > 0) return x * EDGE_RESISTANCE
  if (x < minX) return minX + (x - minX) * EDGE_RESISTANCE
  return x
}

// 손을 뗐을 때 멈출 칸. position: 지금 위치(칸 단위), velocityX: 가로 속도(왼쪽으로 밀면 음수)
export const snapIndex = (
  position: number,
  velocityX: number,
  lastIdx: number,
) => {
  'worklet'
  let target = Math.round(position)
  // 빠르게 밀었으면 지금 위치에서 민 방향의 칸으로
  if (velocityX < -FLING_VELOCITY) target = Math.ceil(position)
  else if (velocityX > FLING_VELOCITY) target = Math.floor(position)
  return Math.min(Math.max(target, 0), lastIdx)
}
