import { generateBase64Id } from '@/helpers';
import { UserDto } from './user-dto';

export class User {
  private constructor(
    private readonly id: string,
    private phone: string,
    private cardIdList: string[],
  ) {}

  static create(props: Omit<UserDto, 'id'> & { id?: string }): User {
    const id = props.id ?? generateBase64Id();
    const phone = props.phone.trim();
    const cardIdList = props.cardIdList;

    return new User(id, phone, cardIdList);
  }

  static fromDTO(dto: UserDto) {
    return User.create(dto);
  }

  toDto(): UserDto {
    return {
      id: this.id,
      phone: this.phone,
      cardIdList: this.cardIdList,
    };
  }
}
