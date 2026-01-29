import { Card } from '@/domain/card/card';
import { CardDto } from '@/domain/card/card-dto';

export const cardService = {
  update: async (card: CardDto): Promise<CardDto | null> => {
    const cardEntity = Card.create(card);

    // Todo
    try {
      // const res = await cardClient.update(cardEntity.toDto());
      return cardEntity.toDto();
    } catch (e) {
      console.log(e);
      return null;
    }
  },
  create: async (card: CardDto): Promise<CardDto | null> => {
    const cardEntity = Card.create(card);
    try {
      // const res = await cardClient.create(cardEntity.toDto());
      return cardEntity.toDto();
    } catch (e) {
      console.log(e);
      return null;
    }
  },
  delete: async (card: CardDto): Promise<boolean> => {
    const { id } = card;
    try {
      // TODO: delete cara in client layer
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
};
