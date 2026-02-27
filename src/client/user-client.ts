import { get, ref, remove, set, update } from '@react-native-firebase/database';
import { UserDto } from '@/domain/user';
import { db } from '@/firebaseApp';

export const userClient = {
  create: async (dto: UserDto): Promise<boolean> => {
    const { id, nickname, phone, cardIdList } = dto;
    const key = id;
    try {
      await set(ref(db, `user/${key}`), {
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
    const key = dto.id;

    try {
      await update(ref(db, `user/${key}`), {
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
      const key = id;
      const snapShot = await get(ref(db, `user/${key}`));
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
      const key = id;
      await remove(ref(db, `user/${key}`));
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
};
