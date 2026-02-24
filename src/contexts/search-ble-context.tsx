import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Alert } from 'react-native';
import ensurePermissions from '@/helpers/ensure-permissions';
import useHeptic from '@/hooks/use-heptic';
import { useBleContext } from '@/contexts';

interface SearchBLEContextValue {
  state: {
    devices: any[];
    rssi: string;
    detected: boolean;
  };
}

const searchBLEContext = createContext({} as SearchBLEContextValue);

export const SearchBLEProvider = ({ children }: PropsWithChildren) => {
  const { setTime, setHepticOption } = useHeptic();
  const { state: bleState, actions } = useBleContext();

  // temp - 디바이스 조회 잘 되나 확인하기 위함

  const [detected, setDetected] = useState(false);

  useEffect(() => {
    console.log('SearchBLE mounted', detected);

    return () => {
      console.log('SearchBLE unmounted', detected);
    };
  }, [detected]);

  useEffect(() => {
    if (!detected && bleState.rssi) {
      setDetected(true);
      setTime(200);
      setHepticOption('impactMedium');
    }
  }, [detected, bleState.rssi, setTime, setHepticOption]);

  useEffect(() => {
    console.log('asd');
    actions.stopBleScan();
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
      actions.stopBleScan();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <searchBLEContext.Provider
      value={{
        state: { devices: bleState.devices, detected, rssi: bleState.rssi },
      }}
    >
      {children}
    </searchBLEContext.Provider>
  );
};

export const useSearchBLEContext = () => useContext(searchBLEContext);
