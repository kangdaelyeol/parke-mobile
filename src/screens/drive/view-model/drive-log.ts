import { logger } from '@/utils'

// 위치 추적 디버깅용 로그 (개발 빌드에서만). Metro 콘솔에서 [Drive]로 검색
export const driveLog = (...args: unknown[]) => {
  if (!__DEV__) return
  const t = new Date().toISOString().slice(11, 23)
  // 객체는 문자열로 펼쳐서, 복사해 붙여도 값이 보이게 한다
  const text = args
    .map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
    .join(' ')
  logger.log(`[Drive ${t}] ${text}`)
}

export const round = (n: number, d = 1) => Math.round(n * 10 ** d) / 10 ** d
