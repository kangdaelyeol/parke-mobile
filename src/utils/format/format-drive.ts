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

// 2026년 10월 22일 14:05
export const formatDateTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return `${date.getFullYear()}년 ${
    date.getMonth() + 1
  }월 ${date.getDate()}일 ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

// 10월 22일 (수) (올해가 아니면 앞에 연도)
export const formatDay = (timestamp: number, now = Date.now()) => {
  const date = new Date(timestamp)
  const day = `${date.getMonth() + 1}월 ${date.getDate()}일 (${
    WEEKDAYS[date.getDay()]
  })`
  return date.getFullYear() === new Date(now).getFullYear()
    ? day
    : `${date.getFullYear()}년 ${day}`
}

// 32분, 1시간 5분 (1분이 안 되면 1분 미만)
export const formatMinutes = (ms: number) => {
  const total = Math.floor(Math.max(0, ms) / 60000)
  if (total < 1) return '1분 미만'
  const h = Math.floor(total / 60)
  const m = total % 60
  if (!h) return `${m}분`
  return m ? `${h}시간 ${m}분` : `${h}시간`
}
