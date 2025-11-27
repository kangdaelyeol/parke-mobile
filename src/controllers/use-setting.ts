import { useEffect, useState } from 'react';
import { settingService } from '../services/settingService';
import { useNavigation } from '@react-navigation/native';
import { manager } from '../background/manager';

export const useSetting = () => {
  const [autoSet, setAutoSet] = useState(false);
  const [notice, setNotice] = useState(false);
  const [active, setActive] = useState(true);
  const navigation = useNavigation<any>();

  // init settings value on UI
  useEffect(() => {
    manager.stopDeviceScan();
    const settings = settingService.getSettings();
    setAutoSet(settings.autoSet as boolean);
    setNotice(settings.notice as boolean);
    setActive(settings.active as boolean);
  }, []);

  const onHomeBtnPress = () => {
    navigation.replace('Home');
  };

  const onAutoSetChange = (val: boolean) => {
    if (val === false) {
      setNotice(true);
      settingService.setNotice(true);
    }

    settingService.setAutoSet(val);
    setAutoSet(val);
  };

  const onActiveChange = (val: boolean) => {
    setActive(val);
    settingService.setActive(val);
  };

  const onNoticeChange = (val: boolean) => {
    setNotice(val);
    settingService.setNotice(val);
  };

  const noticeDisabled = active === false || autoSet === false ? true : false;

  const autoSetDisabled = active === false ? true : false;

  return {
    noticeDisabled,
    autoSetDisabled,
    notice,
    onNoticeChange,
    onActiveChange,
    onAutoSetChange,
    onHomeBtnPress,
    autoSet,
    active,
  };
};
