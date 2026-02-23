import { UserDto } from '@/domain/user';
import { db } from '@/firebaseApp';
import { convertId } from '@/utils';
import { get, ref, remove, set, update } from 'firebase/database';

export const userClient = {
  create: async (dto: UserDto): Promise<boolean> => {
    const { id, nickname, phone, cardIdList } = dto;
    const convertedId = convertId(id);
    try {
      await set(ref(db, `user/${convertedId}`), {
        id,
        nickname,
        phone,
        cardIdList,
      });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  update: async (
    dto: { id: string } & Partial<
      Pick<UserDto, 'cardIdList' | 'nickname' | 'phone'>
    >,
  ): Promise<boolean> => {
    const convertedId = convertId(dto.id);

    try {
      await update(ref(db, `user/${convertedId}`), {
        ...dto,
      });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  getById: async (id: string): Promise<UserDto | null> => {
    try {
      const convertedId = convertId(id);
      const snapShot = await get(ref(db, `user/${convertedId}`));
      if (!snapShot.exists()) return null;
      const userRaw = snapShot.val();
      if (!userRaw.cardIdList) userRaw.cardIdList = [];
      return userRaw as UserDto;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
  deleteById: async (id: string): Promise<boolean> => {
    try {
      const convertedId = convertId(id);
      await remove(ref(db, `user/${convertedId}`));
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
};
