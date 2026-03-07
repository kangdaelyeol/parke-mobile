import { cacheClient } from '@/client';
import { SettingService } from './types';

export const settingService: SettingService = {
  getSettings: () => {
    const notice = cacheClient.getNotice();
    const autoSet = cacheClient.getAutoSet();
    const active = cacheClient.getActive();

    return { notice, autoSet, active };
  },

  setNotice: val => {
    cacheClient.setNotice(val);
  },
  setAutoSet: val => {
    cacheClient.setAutoSet(val);
  },

  setActive: val => {
    cacheClient.setActive(val);
  },
};
