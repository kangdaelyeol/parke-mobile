const pad = (n: number) => String(n).padStart(2, '0')

// 12:34:56 (시간이 없어도 00:로 표시)
export const formatDuration = (ms: number) => {
  const total = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}

// 14:05
export const formatClock = (timestamp: number) => {
  const date = new Date(timestamp)
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

// 1.23 (10km 이상은 소수점 한 자리)
export const formatKm = (meters: number) =>
  (meters / 1000).toFixed(meters < 10000 ? 2 : 1)

// m/s → km/h
export const toKmh = (mps: number) => Math.round(mps * 3.6)
