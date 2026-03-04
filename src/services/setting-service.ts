import { cacheClient } from '@/client';

export const settingService = {
  getSettings: () => {
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
