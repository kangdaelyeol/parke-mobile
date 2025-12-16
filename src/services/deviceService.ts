import { get, ref, serverTimestamp, update } from 'firebase/database';
import { db } from '../firebaseApp';

interface Device {
  deviceId: string;
  phone: string;
  updatedAt: string;
}

export const deviceService = {
  getDeviceBySerial: async (serial: string): Promise<Device | null> => {
    const snapShot = await get(ref(db, `device/${serial}`));
    if (!snapShot.exists()) return null;

    return snapShot.val() as Device;
  },

  updatePhoneNumber: async (
    serial: string,
    deviceId: string,
    phone: string,
  ) => {
    await update(ref(db, `device/${serial}`), {
      phone,
      deviceId,
      updatedAt: serverTimestamp(),
    });
  },
};
