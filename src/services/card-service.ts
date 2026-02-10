import { cardClient } from '@/client';
import { Card, CardDto } from '@/domain/card';

export const cardService = {
  get: async (id: string): Promise<CardDto | null> => {
    const res = await cardClient.getById(id);
    return res;
  },
  getList: async (idList: string[]): Promise<CardDto[] | null> => {
    const res = await Promise.allSettled(idList.map(cardClient.getById));
    if (!res) return null;
    return res
      .filter(
        (r): r is PromiseFulfilledResult<CardDto> =>
          r.status === 'fulfilled' && r.value !== null,
      )
      .map(r => r.value);
  },
  update: async (card: CardDto): Promise<CardDto | null> => {
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
  create: async (card: CardDto): Promise<CardDto | null> => {
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
  delete: async (id: string): Promise<boolean> => {
    return await cardClient.deleteById(id);
  },
  updateAutoChange: async (
    id: string,
    autoChange: boolean,
  ): Promise<boolean> => {
    return await cardClient.update({ id, autoChange });
  },
  updatePhone: async (id: string, phone: string): Promise<Boolean> => {
    return await cardClient.update({ id, phone });
  },
};
