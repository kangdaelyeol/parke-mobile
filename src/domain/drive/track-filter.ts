import { getDistanceMeters } from '@/utils/geo'
import { GeoPoint } from './geo-point'

// 이보다 부정확한 위치는 버린다 (도심/실내에서 30~60m가 흔하다)
export const MAX_ACCURACY_M = 50
// 마지막 기준점에서 이만큼은 움직여야 이동으로 인정한다 (제자리 GPS 흔들림 제거).
// 두 위치의 정확도가 나쁠수록 크게 잡되, 경로가 너무 거칠어지지 않게 상한을 둔다.
export const MIN_SEGMENT_M = 8
export const MAX_SEGMENT_THRESHOLD_M = 25
// 이보다 빠르게 이동한 것으로 계산되면 GPS 튐으로 보고 버린다 (약 250km/h)
export const MAX_SPEED_MPS = 70
// 속도를 직접 계산할 때 필요한 최소 시간 간격 (짧으면 값이 튄다)
export const MIN_SPEED_SAMPLE_S = 2

// 정확도까지 담은 위치. 거리 계산의 기준점이 된다
export type TrackPoint = GeoPoint & { accuracy: number }

// 기기에서 받은 위치 하나
export interface GpsFix {
  latitude: number
  longitude: number
  accuracy: number // m
  speed: number | null // m/s, 기기가 모르면 null 또는 음수
  timestamp: number
}

// 새 위치를 경로에 넣을지 판정한 결과
export type FixResult =
  // 정확도가 나빠 버린다
  | { type: 'inaccurate' }
  // 첫 위치: 기준점으로 삼는다
  | { type: 'first'; point: TrackPoint; speed: number }
  // 기준점에서 충분히 멀어지지 않았다 (흔들림). 기준점은 그대로 두므로 천천히 움직여도 쌓이면 반영된다
  | {
      type: 'jitter'
      point: TrackPoint
      speed: number | null
      meters: number
      threshold: number
    }
  // 너무 빠르게 이동했다 (GPS 튐). 버린다
  | { type: 'jump'; point: TrackPoint; meters: number; seconds: number }
  // 이동으로 인정: 경로에 더하고 기준점을 옮긴다
  | {
      type: 'accepted'
      point: TrackPoint
      meters: number
      seconds: number
      speed: number | null
    }

// 마지막 기준점(anchor)과 새 위치로 판정한다
export const evaluateFix = (
  anchor: TrackPoint | null,
  fix: GpsFix,
): FixResult => {
  if (fix.accuracy > MAX_ACCURACY_M) return { type: 'inaccurate' }

  // iOS/Android가 주는 속도는 위치 차이로 계산한 값보다 정확하다 (없으면 -1/null)
  const nativeSpeed = fix.speed !== null && fix.speed >= 0 ? fix.speed : null
  const point: TrackPoint = {
    latitude: fix.latitude,
    longitude: fix.longitude,
    timestamp: fix.timestamp,
    speed: nativeSpeed,
    accuracy: fix.accuracy,
  }
  if (!anchor) return { type: 'first', point, speed: nativeSpeed ?? 0 }

  const meters = getDistanceMeters(anchor, point)
  const seconds = (point.timestamp - anchor.timestamp) / 1000
  const threshold = Math.max(
    MIN_SEGMENT_M,
    Math.min((anchor.accuracy + point.accuracy) / 2, MAX_SEGMENT_THRESHOLD_M),
  )
  if (meters < threshold)
    return { type: 'jitter', point, speed: nativeSpeed, meters, threshold }
  if (seconds > 0 && meters / seconds > MAX_SPEED_MPS)
    return { type: 'jump', point, meters, seconds }

  const segmentSpeed = seconds >= MIN_SPEED_SAMPLE_S ? meters / seconds : null
  return {
    type: 'accepted',
    point,
    meters,
    seconds,
    speed: nativeSpeed ?? segmentSpeed,
  }
}
