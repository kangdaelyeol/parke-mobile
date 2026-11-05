// 주행 경로의 위치 하나
export interface GeoPoint {
  latitude: number
  longitude: number
  timestamp: number
  speed: number | null // m/s
}
