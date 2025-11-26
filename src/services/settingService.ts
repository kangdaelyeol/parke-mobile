import { cache } from '../storage';

const ensureInitialized = () => {
  if (cache.getNotice() === null) {
    cache.setNotice(true);
    cache.setAutoSet(true);
    cache.setActive(true);
  }
};

export const settingService = {
  getSettings: () => {
    ensureInitialized();
    const notice = cache.getNotice();
    const autoSet = cache.getAutoSet();
    const active = cache.getActive();

    return { notice, autoSet, active };
  },

  setNotice: (val: boolean) => {
    cache.setNotice(val);
  },
  setAutoSet: (val: boolean) => {
    cache.setAutoSet(val);
  },

  setActive: (val: boolean) => {
    cache.setActive(val);
  },
};
