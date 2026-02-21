import { manager, stopBackgroundScan } from '@/ble-manager';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { serverTimestamp } from 'firebase/database';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUserContext } from '@/contexts';
import { convertPhone } from '@/helpers';
import { extractNumber } from '@/utils';
import { cardService, userService } from '@/services';
import { ScanCompleteStackNavigationProp } from '@/navigation/types';

interface ScanCompleteContextValue {
  actions: {
    phoneInput: (v: string) => void;
    nameInput: (v: string) => void;
    messageInput: (v: string) => void;
    serialInput: (v: string) => void;
    nextPress: () => void;
    savePress: (deviceId: string) => Promise<void>;
    prevPress: () => void;
    scanPress: () => void;
    scanBackPress: () => void;
    serialInputPress: () => void;
  };
  state: {
    phone: string;
    name: string;
    message: string;
    serial: string;
    currentStep: number;
    loading: boolean;
    scanPage: boolean;
    serialInput: boolean;
  };
}

const ScanCompleteContext = createContext({} as ScanCompleteContextValue);

export const ScanCompleteContextProvider = ({
  children,
}: PropsWithChildren) => {
  const { user } = useUserContext();

  const [phone, setPhone] = useState('');
  const [name, setName] = useState(`Parke${user.cardIdList.length + 1}`);
  const [message, setMessage] = useState('');
  const [serial, setSerial] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [scanPage, setScanPage] = useState(true);
  const [serialInput, setSerialInput] = useState(false);

  const navigation = useNavigation<ScanCompleteStackNavigationProp>();

  const actions = {
    phoneInput: (v: string) => {
      setPhone(extractNumber(v));
    },
    nameInput: (v: string) => {
      setName(v);
    },
    messageInput: (v: string) => {
      setMessage(v);
    },
    serialInput: (v: string) => {
      setSerial(v);
    },
    nextPress: () => {
      setCurrentStep(prev => prev + 1);
    },
    prevPress: () => {
      setCurrentStep(prev => prev - 1);
    },
    savePress: async (deviceId: string) => {
      setLoading(true);

      const cardRes = await cardService.create({
        id: serial,
        phone,
        message,
        title: name,
        updatedBy: user.nickname,
        updatedAt: serverTimestamp(),
        autoChange: true,
        deviceId,
      });

      if (!cardRes) {
        Alert.alert('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        return setLoading(false);
      }

      const userRes = await userService.updateCardList(user.id, [
        ...user.cardIdList,
        serial,
      ]);

      if (!userRes) {
        Alert.alert('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        return setLoading(false);
      }

      Alert.alert('저장 성공!');
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    },
    scanPress: () => {
      setScanPage(true);
    },
    scanBackPress: () => {
      setScanPage(false);
    },
    serialInputPress: () => {
      setSerialInput(true);
    },
  };

  const state = {
    phone: convertPhone(phone),
    name,
    message,
    serial,
    currentStep,
    loading,
    scanPage,
    serialInput,
  };

  useEffect(() => {
    manager.stopDeviceScan();
    stopBackgroundScan();
    setPhone(user.phone);
  }, [user.phone]);

  return (
    <ScanCompleteContext.Provider value={{ state, actions }}>
      {children}
    </ScanCompleteContext.Provider>
  );
};

export const useScanCompleteContext = () => useContext(ScanCompleteContext);
