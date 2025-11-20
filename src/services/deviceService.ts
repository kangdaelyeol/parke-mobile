import { get, ref, serverTimestamp, update } from 'firebase/database';
import { db } from '../firebaseApp';

export const deviceService = {
  getPhoneNumber: async (deviceId: string): Promise<string | null> => {
    const snapShot = await get(ref(db, `device/${deviceId}/phone`));
    if (!snapShot.exists()) return null;
    return snapShot.val() as string;
  },
  updatePhoneNumber: async (deviceId: string, phoneNumber: string) => {
    await update(ref(db, `device/${deviceId}`), {
      phone: phoneNumber,
      updatedAt: serverTimestamp(),
    });
  },
};
