import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ensurePermissions from '@/helpers/ensure-permissions';
import { SearchBleStackNavigationProp } from '@/navigation/types';
import useHeptic from '@/hooks/use-heptic';
import { useBleContext } from './ble-context';

interface SearchBLEContextValue {
  state: {
    devices: any[];
    rssi: string;
    detected: boolean;
  };
  actions: {
    goBack: () => void;
  };
}

const searchBLEContext = createContext({} as SearchBLEContextValue);

export const SearchBLEProvider = ({ children }: PropsWithChildren) => {
  const { setTime, setHepticOption } = useHeptic();
  const { state: bleState, actions } = useBleContext();

  // temp - 디바이스 조회 잘 되나 확인하기 위함

  const [detected, setDetected] = useState(false);

  const navigation = useNavigation<SearchBleStackNavigationProp>();

  if (!detected && bleState.rssi) {
    setDetected(true);
    setTime(200);
    setHepticOption('impactMedium');
  }

  useEffect(() => {
    actions.stopBackgroundScan();
    let sub: { remove: () => void } | undefined;
    let unmounted = false;

    (async () => {
      const ok = await ensurePermissions();
      if (!ok || unmounted) {
        Alert.alert('권한 필요', 'BLE 권한을 허용해주세요');
        return;
      }
      await actions.stopBleScan();

      sub = bleState.bleManager?.onStateChange(state => {
        if (state === 'PoweredOn') {
          actions.startSearchBle();
          sub?.remove();
        }
      }, true);
    })();

    return () => {
      unmounted = true;
      sub?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <searchBLEContext.Provider
      value={{
        state: { devices: bleState.devices, detected, rssi: bleState.rssi },
        actions: {
          goBack,
        },
      }}
    >
      {children}
    </searchBLEContext.Provider>
  );
};

export const useSearchBLEContext = () => useContext(searchBLEContext);
