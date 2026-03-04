import { CardDto } from './card-dto';
import { serverTimestamp } from 'firebase/database';

export class Card {
  private constructor(
    private readonly id: string,
    private title: string,
    private phone: string,
    private message: string,
    private scan: boolean,
    private updatedAt: object,
    private updatedBy: string,
    private deviceId: string,
    private ownerList: string[],
  ) {}

  static create(props: Omit<CardDto, 'id'> & { id?: string }): Card {
    const id = props.id ?? '';
    const title = props.title.trim();

    const phone = props.phone ?? '';
    const message = props.message ?? '';
    const scan = !!props.scan;
    const updatedAt = props.updatedAt ?? serverTimestamp();
    const updatedBy = props.updatedBy ?? '';
    const deviceId = props.deviceId ?? '';
    const ownerList = props.ownerList ?? [];

    return new Card(
      id,
      title,
      phone,
      message,
      scan,
      updatedAt,
      updatedBy,
      deviceId,
      ownerList,
    );
  }

  static fromDto(dto: CardDto): Card {
    return Card.create(dto);
  }

  toDto(): CardDto {
    return {
      id: this.id,
      title: this.title,
      phone: this.phone,
      message: this.message,
      scan: this.scan,
      updatedAt: this.updatedAt,
      updatedBy: this.updatedBy,
      deviceId: this.deviceId,
      ownerList: this.ownerList,
    };
  }
}
