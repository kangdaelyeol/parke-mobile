import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';

type InitStackParamList = {
  Init: undefined;
  Home: undefined;
};

export type Nav = NativeStackNavigationProp<InitStackParamList, 'Init'>;

export const useInitController = (navigation: Nav) => {
  const [nicknameFocus, setNicknameFocuse] = useState(false);
  const [phoneFocuse, setPhoneFocuse] = useState(false);
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');

  const handlers = {
    nicknameFocus: () => {
      setNicknameFocuse(true);
    },
    nicknameBlur: () => {
      setNicknameFocuse(false);
    },
    phoneFocus: () => {
      setPhoneFocuse(true);
    },
    phoneBlur: () => {
      setPhoneFocuse(false);
    },

    phoneInput: (val: string) => {
      setPhone(val.replace(/[^0-9]/gi, ''));
    },
    nicknameInput: (val: string) => setNickname(val),

    savePress: () => {
      navigation.replace('Home');
    },
    skipPress: () => {
      navigation.replace('Home');
    },
  };

  return {
    handlers,
    nicknameFocus,
    phoneFocuse,
    nickname,
    phone,
  };
};
