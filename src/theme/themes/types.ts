import { CHART, CODE, GLASS, TEXT, TONE } from './glass-dashboard/tokens'

// 테마 이름 (테마가 늘면 여기에 더한다)
export type ThemeId = 'glass-dashboard'

type Strings<T> = {
  readonly [K in keyof T]: T[K] extends string ? string : T[K]
}

// 테마가 갖춰야 할 토큰. 첫 번째 테마의 토큰 모양을 기준으로 한다
export interface ThemeTokens {
  glass: Strings<typeof GLASS>
  text: Strings<typeof TEXT>
  tone: Strings<typeof TONE>
  accent: { fill: string; tile: string; glow: string }
  link: string
  chart: Strings<typeof CHART>
  code: Strings<typeof CODE>
}

// 테마 하나: 설정에 보이는 정보 + 미리보기 색 + 토큰
export interface AppTheme {
  id: ThemeId
  name: string
  description: string
  // 따라 만든 디자인 파일
  source: string
  // 설정의 테마 카드 미리보기에 쓰는 색
  preview: {
    accent: string
    tones: string[]
  }
  tokens: ThemeTokens
}
