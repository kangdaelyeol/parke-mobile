const pad = (n: number) => String(n).padStart(2, '0')

// 기기 시간대 기준 날짜 (2026-11-05). 오늘의 현황을 자정에 새로 시작할 때 쓴다
// (toISOString은 UTC라 한국에서는 오전 9시에 날짜가 바뀐다)
export const toDateKey = (timestamp = Date.now()) => {
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}`
}
