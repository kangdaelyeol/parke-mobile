import { useState } from 'react';

export const useSetting = () => {
  const [autoChange, setAutoChange] = useState(false);
  const [notice, setNotice] = useState(false);
  const [active, setActive] = useState(true);

  const onAutoChange = (val: boolean) => {
    if (val === false) {
      setNotice(true);
    }

    setAutoChange(val);
  };
  
  const noticeDisabled =
    active === false || autoChange === false ? true : false;

  const autoChangeDisabled = active === false ? true : false;

  return {
    noticeDisabled,
    autoChangeDisabled,
    notice,
    setActive,
    onAutoChange,
    autoChange,
    setNotice,
    active,
  };
};
