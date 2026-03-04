import { cacheClient } from '@/client';

const ensureInitialized = () => {
  if (cacheClient.getNotice() === null) {
    cacheClient.setNotice(true);
    cacheClient.setAutoSet(true);
    cacheClient.setActive(true);
  }
};

export const settingService = {
  getSettings: () => {
    ensureInitialized();
    const notice = cacheClient.getNotice();
    const autoSet = cacheClient.getAutoSet();
    const active = cacheClient.getActive();

    return { notice, autoSet, active };
  },

  setNotice: (val: boolean) => {
    cacheClient.setNotice(val);
  },
  setAutoSet: (val: boolean) => {
    cacheClient.setAutoSet(val);
  },

  setActive: (val: boolean) => {
    cacheClient.setActive(val);
  },
};
