import { userClient } from '@/client';
import { CardDto } from '@/domain/card';
import { User } from '@/domain/user';
import { UserDto } from '@/domain/user/user-dto';

export const userService = {
  get: async (id: string): Promise<UserDto | null> => {
    const res = await userClient.getById(id);
    return res;
  },
  create: async (
    user: { id: string } & Partial<
      Pick<UserDto, 'cardIdList' | 'id' | 'nickname' | 'phone'>
    >,
  ): Promise<UserDto | null> => {
    const dto = User.create(user).toDto();
    const res = await userClient.create(dto);
    if (!res) return null;
    return dto;
  },
  updateNicknameAndPhone: async (
    id: string,
    nickname: string,
    phone: string,
  ): Promise<boolean> => {
    return await userClient.update({ id, nickname, phone });
  },
  updateCardList: async (id: string, cardList: string[]): Promise<boolean> => {
    return await userClient.update({ id, cardIdList: cardList });
  },
  delete: async (id: string): Promise<boolean> => {
    return await userClient.deleteById(id);
  },
};
