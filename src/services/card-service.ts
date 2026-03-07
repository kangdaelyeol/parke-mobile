import { serverTimestamp } from 'firebase/database';
import { cardClient, userClient } from '@/client';
import { Card, CardDto } from '@/domain/card';
import { CardService } from './types';

export const cardService: CardService = {
  get: async (id) => {
    const res = await cardClient.getById(id);
    return res;
  },
  getList: async (idList) => {
    const res = await Promise.allSettled(idList.map(cardClient.getById));
    if (!res) return null;
    return res
      .filter(
        (r): r is PromiseFulfilledResult<CardDto> =>
          r.status === 'fulfilled' && r.value !== null,
      )
      .map(r => r.value);
  },
  update: async (card) => {
    const cardEntity = Card.fromDto(card);

    try {
      const cardDto = cardEntity.toDto();
      const res = await cardClient.update(cardDto);

      if (res === true) return cardDto;
      else return null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
  create: async (card) => {
    const cardEntity = Card.create(card);
    try {
      const res = await cardClient.create(cardEntity.toDto());
      if (res !== null) return res;
      else return null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
  delete: async (cardId, userId) => {
    const card = await cardClient.getById(cardId);
    const user = await userClient.getById(userId);
    if (!user || !card) return false;
    const newCardIdList = user.cardIdList.filter(id => id !== cardId);

    const res = await userClient.update({
      id: userId,
      cardIdList: newCardIdList,
    });
    if (!res) return false;
    const newOwnerList = card.ownerList.filter(id => id !== userId);
    if (newOwnerList.length === 0) return await cardClient.deleteById(cardId);
    return cardClient.update({ ...card, ownerList: newOwnerList });
  },
  updateScan: async (id, scan) => {
    return await cardClient.update({ id, scan });
  },
  updatePhone: async (id, phone) => {
    return await cardClient.update({ id, phone });
  },
  updateUpdatedAt: async (id) => {
    return await cardClient.update({ id, updatedAt: serverTimestamp() });
  },
};
