import { cardClient, userClient } from '@/client';
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
  updateCardIdList: async (
    id: string,
    cardList: string[],
  ): Promise<boolean> => {
    return await userClient.update({ id, cardIdList: cardList });
  },
  delete: async (id: string): Promise<boolean> => {
    const user = await userClient.getById(id);
    if (!user) return false;

    user.cardIdList?.forEach(async cardId => {
      const card = (await cardClient.getById(cardId)) as CardDto;
      card.ownerList = card.ownerList.filter(userId => userId !== id);
      if (card.ownerList.length === 0) await cardClient.deleteById(cardId);
      else await cardClient.update(card);
    });

    return await userClient.deleteById(id);
  },
  deleteCard: async (userId: string, cardId: string): Promise<boolean> => {
    const user = await userClient.getById(userId);
    const card = await cardClient.getById(cardId);
    if (!user || !card) return false;

    const newCardIdList = user.cardIdList.filter(id => id !== cardId);
    user.cardIdList = newCardIdList;
    userClient.update(user);

    const newCardOwnerList = card.ownerList.filter(id => id !== userId);
    if (newCardOwnerList.length === 0) return cardClient.deleteById(cardId);

    card.ownerList = newCardOwnerList;
    return cardClient.update(card);
  },
};
