import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import useHeptic from '@/hooks/use-heptic';
import { useBleContext } from '@/contexts';
import { navigationRef } from '@/navigation/navigation-ref';
import { StackActions } from '@react-navigation/native';
import { BLE_DEVICE_NAME, CHAR_UUID, SERVICE_UUID } from '@/constants';
import { generateBase64Id, getDeviceId } from '@/helpers';

interface SearchBLEContextValue {
  state: {
    devices: any[];
    rssi: string;
    detected: boolean;
  };
  actions: {
    startSearchBle: () => void;
  };
}

const searchBLEContext = createContext({} as SearchBLEContextValue);

export const SearchBleProvider = ({ children }: PropsWithChildren) => {
  const { setTime, setHepticOption } = useHeptic();
  const { state: bleState } = useBleContext();
  const searchbleRef = useRef(false);

  const [detected, setDetected] = useState(false);
  const [devices, setDevices] = useState<any[]>([]);
  const [rssi, setRssi] = useState('');

  useEffect(() => {
    if (!detected && rssi) {
      setDetected(true);
      setTime(200);
      setHepticOption('impactMedium');
    }
  }, [detected, rssi, setTime, setHepticOption]);

  const actions = {
    startSearchBle: useCallback(() => {
      bleState.scanSessionRef.current++;
      const bleManager = bleState.bleManager;
      console.log('startSearchBle1');
      if (searchbleRef.current) return;
      console.log('startSearchBle2');
      searchbleRef.current = true;
      setDevices([]);

      bleManager?.startDeviceScan(
        null,
        { allowDuplicates: true },
        async (error, device) => {
          if (error || !device) return;

          /* temp - 디바이스 조회 잘 되나 확인하기 위함 */

          setDevices(prev => {
            const exists = prev.find(d => d.id === device.id);
            if (exists) return prev;
            return [...prev, { id: device.id, name: device.name }];
          });

          if ((device.name ?? '').startsWith(BLE_DEVICE_NAME) === false) return;

          setRssi(String(device.rssi));

          if (!device.rssi || device.rssi < -40) return;

          try {
            bleManager?.stopDeviceScan();
            const d = await device.connect();
            await d.discoverAllServicesAndCharacteristics();
            const deviceId = await getDeviceId(d);
            if (deviceId) {
              if (navigationRef.isReady())
                navigationRef.dispatch(
                  StackActions.replace('ScanComplete', { value: deviceId }),
                );
            } else {
              const base64Id = generateBase64Id();
              await device.writeCharacteristicWithResponseForService(
                SERVICE_UUID,
                CHAR_UUID,
                base64Id,
              );
              if (navigationRef.isReady())
                navigationRef.dispatch(
                  StackActions.replace('ScanComplete', { value: base64Id }),
                );
            }
            await d.cancelConnection();
          } catch (e) {
            console.log(e);
          }
        },
      );
    }, [bleState.bleManager, bleState.scanSessionRef]),
  };

  return (
    <searchBLEContext.Provider
      value={{
        state: { devices, detected, rssi },
        actions,
      }}
    >
      {children}
    </searchBLEContext.Provider>
  );
};

export const useSearchBleContext = () => useContext(searchBLEContext);
