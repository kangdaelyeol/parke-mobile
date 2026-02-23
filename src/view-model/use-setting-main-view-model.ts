import { useEffect, useState } from 'react';
import { settingService } from '@/services';
import { cache } from '@/storage';
import { SettingMainViewModel } from '@setting/types';

export const useSettingMainViewModel = (): SettingMainViewModel => {
  const [autoSet, setAutoSet] = useState(false);
  const [notice, setNotice] = useState(false);
  const [active, setActive] = useState(true);

  // init settings value on UI
  useEffect(() => {
    cache.clearDeniedAt();
    const settings = settingService.getSettings();
    setAutoSet(settings.autoSet as boolean);
    setNotice(settings.notice as boolean);
    setActive(settings.active as boolean);
  }, []);

  const noticeDisabled = active === false || autoSet === false ? true : false;

  const autoSetDisabled = active === false ? true : false;

  const state = {
    noticeDisabled,
    autoSetDisabled,
    notice,
    autoSet,
    active,
  };

  const actions = {
    autoSetChange: (val: boolean) => {
      if (val === false) {
        setNotice(true);
        settingService.setNotice(true);
      }

      settingService.setAutoSet(val);
      setAutoSet(val);
    },

    activeChange: (val: boolean) => {
      setActive(val);
      settingService.setActive(val);
    },

    noticeChange: (val: boolean) => {
      setNotice(val);
      settingService.setNotice(val);
    },
  };

  return {
    state,
    actions,
  };
};
