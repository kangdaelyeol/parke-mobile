import { generateBase64Id } from '@/helpers';
import { CardDto } from './card-dto';

export class Card {
  private constructor(
    private readonly id: string,
    private title: string,
    private phone: string,
    private message: string,
    private autoChange: boolean,
  ) {}

  static create(props: Omit<CardDto, 'id'> & { id?: string }): Card {
    const id = props.id ?? generateBase64Id();
    const title = props.title.trim();

    const phone = props.phone ?? '';
    const message = props.message ?? '';
    const autoChange = !!props.autoChange;

    return new Card(id, title, phone, message, autoChange);
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
      autoChange: this.autoChange,
    };
  }
}
