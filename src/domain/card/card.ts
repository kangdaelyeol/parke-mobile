import { CardDto } from './card-dto'
import { serverTimestamp } from 'firebase/database'

export class Card {
  private constructor(
    private readonly id: string,
    private title: string,
    private phone: string,
    private message: string,
    private updatedAt: object,
    private deviceId: string,
    private ownerList: string[],
  ) {}

  static create(props: Omit<CardDto, 'id'> & { id?: string }): Card {
    const id = props.id ?? ''
    const title = props.title.trim()

    const phone = props.phone ?? ''
    const message = props.message ?? ''
    const updatedAt = props.updatedAt ?? serverTimestamp()
    const deviceId = props.deviceId ?? ''
    const ownerList = props.ownerList ?? []

    return new Card(id, title, phone, message, updatedAt, deviceId, ownerList)
  }

  static fromDto(dto: CardDto): Card {
    return Card.create(dto)
  }

  toDto(): CardDto {
    return {
      id: this.id,
      title: this.title,
      phone: this.phone,
      message: this.message,
      updatedAt: this.updatedAt,
      deviceId: this.deviceId,
      ownerList: this.ownerList,
    }
  }
}
