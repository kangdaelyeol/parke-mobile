import { generateBase64Id } from '@/helpers';
import { UserDto } from './user-dto';

export class User {
  private constructor(
    private readonly id: string,
    private nickname: string,
    private phone: string,
    private cardIdList: string[],
  ) {}

  static create(props: Partial<UserDto>): User {
    const id = props.id ?? generateBase64Id();
    const phone = props.phone?.trim() ?? '';
    const nickname = props.nickname ?? '';
    const cardIdList = props.cardIdList ?? [];

    return new User(id, nickname, phone, cardIdList);
  }

  static fromDto(dto: UserDto) {
    return User.create(dto);
  }

  toDto(): UserDto {
    return {
      id: this.id,
      phone: this.phone,
      nickname: this.nickname,
      cardIdList: this.cardIdList,
    };
  }
}
