export const CARD_THEMES = ['dark', 'light', 'amber', 'mint'] as const

export type CardTheme = (typeof CARD_THEMES)[number]

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
  custom: CardCustom
  updatedAt: unknown
  deviceId: string
  ownerList: string[]
}

export type CardInfo = Pick<CardDto, 'title' | 'phone' | 'theme' | 'custom'>
