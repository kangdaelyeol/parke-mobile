import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
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
    savePress: () => Promise<void>;
    prevPress: () => void;
    scanPress: () => void;
    scanBackPress: () => void;
    serialInputPress: () => void;
    serialScan: (v: string) => void;
    setDeviceId: React.Dispatch<React.SetStateAction<string>>;
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
  const { user, setUser } = useUserContext();

  const [phone, setPhone] = useState('');
  const [name, setName] = useState(`Parke${user.cardIdList.length + 1}`);
  const [message, setMessage] = useState('');
  const [serial, setSerial] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [scanPage, setScanPage] = useState(false);
  const [serialInput, setSerialInput] = useState(false);
  const [serialScanned, setSerialScanned] = useState(false);
  const [deviceId, setDeviceId] = useState('');

  const navigation = useNavigation<ScanCompleteStackNavigationProp>();

  const actions = useMemo(
    () => ({
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
      savePress: async () => {
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
          ownerList: [user.id],
        });

        if (!cardRes) {
          Alert.alert('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
          return setLoading(false);
        }

        const newCardIdList = [...user.cardIdList, serial];

        const userRes = await userService.updateCardIdList(
          user.id,
          newCardIdList,
        );

        if (!userRes) {
          Alert.alert('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
          return setLoading(false);
        }

        setUser(prev => ({ ...prev, cardIdList: newCardIdList }));

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
      serialScan: (serialNum: string) => {
        setSerial(serialNum);
        setScanPage(false);
        setSerialScanned(true);
      },
      setDeviceId,
    }),
    [
      message,
      name,
      navigation,
      phone,
      serial,
      setUser,
      user.cardIdList,
      user.id,
      user.nickname,
      deviceId,
    ],
  );

  useEffect(() => {
    if (!serialScanned) return;
    actions.savePress();
  }, [actions, serialScanned]);

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
    setPhone(user.phone);
  }, [user.phone, setPhone]);

  return (
    <ScanCompleteContext.Provider value={{ state, actions }}>
      {children}
    </ScanCompleteContext.Provider>
  );
};

export const useScanCompleteContext = () => useContext(ScanCompleteContext);
