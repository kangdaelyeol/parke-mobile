import {
  get,
  ref,
  remove,
  serverTimestamp,
  set,
  update,
} from 'firebase/database';
import { db } from '@/firebaseApp';
import { Card, CardDto } from '@/domain/card';

export const cardClient = {
  create: async (dto: CardDto): Promise<CardDto | null> => {
    const entity = Card.fromDto(dto);
    const { id, title, phone, message, autoChange, updatedBy } = entity.toDto();
    try {
      await set(ref(db, `card/${id}`), {
        id,
        title,
        phone,
        message,
        autoChange,
        updatedAt: serverTimestamp(),
        updatedBy,
      });
    } catch (e) {
      console.log(e);
      return null;
    }
    return dto;
  },
  getById: async (id: string): Promise<CardDto | null> => {
    try {
      const snapShot = await get(ref(db, `/card/${id}`));
      if (!snapShot.exists()) return null;
      return snapShot.val() as CardDto;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
  deleteById: async (id: string): Promise<boolean> => {
    try {
      await remove(ref(db, `card/${id}`));
    } catch (e) {
      console.log(e);
      return false;
    }
    return true;
  },
  update: async (
    dto: { id: string } & Partial<
      Pick<
        CardDto,
        'autoChange' | 'message' | 'phone' | 'title' | 'updatedAt' | 'updatedBy'
      >
    >,
  ): Promise<boolean> => {
    const { id } = dto;

    try {
      await update(ref(db, `card/${id}`), {
        ...dto,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
};
