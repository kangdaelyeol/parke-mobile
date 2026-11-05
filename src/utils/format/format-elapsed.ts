// 지난 시간(분)을 큰 숫자 + 단위로: 방금 / 12분 전 / 3시간 전 / 2일 전
export const formatElapsed = (
  minutes: number,
): { value: string; unit?: string } => {
  if (minutes < 1) return { value: '방금' }
  if (minutes < 60) return { value: String(minutes), unit: '분 전' }
  if (minutes < 60 * 24)
    return { value: String(Math.floor(minutes / 60)), unit: '시간 전' }
  return { value: String(Math.floor(minutes / (60 * 24))), unit: '일 전' }
}
