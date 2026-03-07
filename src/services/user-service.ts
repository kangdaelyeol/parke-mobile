import { cardClient, userClient } from '@/client';
import { CardDto } from '@/domain/card';
import { User } from '@/domain/user';
import { UserService } from './types';

const isCardDto = (obj: any): obj is CardDto => {
  return (
    obj.id ||
    obj.title ||
    obj.phone ||
    obj.message ||
    obj.scan ||
    obj.updatedAt ||
    obj.updatedBy ||
    obj.deviceId ||
    obj.ownerList
  );
};

export const userService: UserService = {
  get: async id => {
    const user = await userClient.getById(id);
    return user;
  },
  create: async user => {
    const dto = User.create(user).toDto();
    const res = await userClient.create(dto);
    if (!res) return null;
    return dto;
  },
  updateNicknameAndPhone: async (id, nickname, phone) => {
    return await userClient.update({ id, nickname, phone });
  },
  updateCardIdList: async (id, cardList) => {
    return await userClient.update({ id, cardIdList: cardList });
  },
  delete: async id => {
    const user = await userClient.getById(id);
    if (!user) return false;

    user.cardIdList.forEach(async cardId => {
      const card = await cardClient.getById(cardId);
      if (!isCardDto(card)) return;
      
      card.ownerList = card.ownerList.filter(userId => userId !== id);
      if (card.ownerList.length === 0) await cardClient.deleteById(cardId);
      else await cardClient.update(card);
    });

    return await userClient.deleteById(id);
  },
  deleteCard: async (userId, cardId) => {
    const user = await userClient.getById(userId);
    const card = await cardClient.getById(cardId);
    if (!user || !card) return false;

    const newCardIdList = user.cardIdList.filter(id => id !== cardId);
    user.cardIdList = newCardIdList;
    await userClient.update(user);

    const newCardOwnerList = card.ownerList.filter(id => id !== userId);
    if (newCardOwnerList.length === 0) return cardClient.deleteById(cardId);

    card.ownerList = newCardOwnerList;
    return cardClient.update(card);
  },
};
