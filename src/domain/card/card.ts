import {
  CARD_LAYOUTS,
  CARD_THEMES,
  CardCustom,
  CardDto,
  CardLayout,
  CardTheme,
} from './card-dto'
import { serverTimestamp } from '@react-native-firebase/database'

export const CARD_SCALE_MIN = 0.85
export const CARD_SCALE_MAX = 1.3
export const CARD_MESSAGE_MAX_LENGTH = 40
export const DEFAULT_CARD_THEME: CardTheme = 'dark'
export const DEFAULT_CARD_LAYOUT: CardLayout = 'a'
export const DEFAULT_CARD_CUSTOM: CardCustom = {
  accent: '#383bf9',
  scale: 1,
  message: '',
}

export const isCardAccent = (v: unknown): v is string =>
  typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v)

export const clampCardScale = (v: number) =>
  Math.min(CARD_SCALE_MAX, Math.max(CARD_SCALE_MIN, Math.round(v * 100) / 100))

type CardProps = Omit<CardDto, 'id' | 'theme' | 'layout' | 'custom'> & {
  id?: string
  theme?: CardTheme
  layout?: CardLayout
  custom?: Partial<CardCustom>
  // 스키마 변경 전 카드는 message가 최상위에 있다
  message?: string
}

export class Card {
  private constructor(
    private readonly id: string,
    private title: string,
    private phone: string,
    private theme: CardTheme,
    private layout: CardLayout,
    private custom: CardCustom,
    private updatedAt: object,
    private deviceId: string,
    private ownerList: string[],
  ) {}

  static create(props: CardProps): Card {
    const id = props.id ?? ''
    const title = (props.title ?? '').trim()

    const phone = props.phone ?? ''
    const theme =
      props.theme && CARD_THEMES.includes(props.theme)
        ? props.theme
        : DEFAULT_CARD_THEME
    const layout =
      props.layout && CARD_LAYOUTS.includes(props.layout)
        ? props.layout
        : DEFAULT_CARD_LAYOUT
    const custom = {
      accent: isCardAccent(props.custom?.accent)
        ? props.custom.accent
        : DEFAULT_CARD_CUSTOM.accent,
      scale:
        typeof props.custom?.scale === 'number'
          ? clampCardScale(props.custom.scale)
          : DEFAULT_CARD_CUSTOM.scale,
      message: (
        props.custom?.message ??
        props.message ??
        DEFAULT_CARD_CUSTOM.message
      ).slice(0, CARD_MESSAGE_MAX_LENGTH),
    }
    const updatedAt = props.updatedAt ?? serverTimestamp()
    const deviceId = props.deviceId ?? ''
    const ownerList = props.ownerList ?? []

    return new Card(
      id,
      title,
      phone,
      theme,
      layout,
      custom,
      updatedAt,
      deviceId,
      ownerList,
    )
  }

  static fromDto(dto: CardDto): Card {
    return Card.create(dto)
  }

  toDto(): CardDto {
    return {
      id: this.id,
      title: this.title,
      phone: this.phone,
      theme: this.theme,
      layout: this.layout,
      custom: this.custom,
      updatedAt: this.updatedAt,
      deviceId: this.deviceId,
      ownerList: this.ownerList,
    }
  }
}
