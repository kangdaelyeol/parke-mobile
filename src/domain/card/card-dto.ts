export const CARD_THEMES = ['dark', 'light', 'amber', 'mint'] as const

export type CardTheme = (typeof CARD_THEMES)[number]

// 웹 카드 화면 디자인. 없거나 모르는 값이면 'a'
export const CARD_LAYOUTS = ['a', 'b', 'c', 'd'] as const

export type CardLayout = (typeof CARD_LAYOUTS)[number]

export interface CardCustom {
  accent: string // # + 6자리 hex
  scale: number // 0.85 ~ 1.3
  message: string // 최대 40자
}

export interface CardDto {
  id: string
  title: string
  phone: string
  theme: CardTheme
  layout: CardLayout
  custom: CardCustom
  updatedAt: unknown
  deviceId: string
  ownerList: string[]
}

export type CardInfo = Pick<
  CardDto,
  'title' | 'phone' | 'theme' | 'layout' | 'custom'
>
