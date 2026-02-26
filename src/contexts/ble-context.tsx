import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { BleManager } from 'react-native-ble-plx';

interface BleContextValue {
  actions: {
    stopBleScan: (session: number) => Promise<void>;
  };
  state: {
    bleManagerRef: React.RefObject<BleManager | null>;
    scanSessionRef: React.RefObject<number>;
    searchBleRef: React.RefObject<boolean>;
    bgScanRef: React.RefObject<boolean>;
    bleManagerIsReady: boolean;
  };
}

const BleContext = createContext({} as BleContextValue);
const g = globalThis as any;

export const BleContextProvider = ({ children }: PropsWithChildren) => {
  const bleManagerRef = useRef<BleManager | null>(null);
  const scanSessionRef = useRef(0);
  const [bleManagerIsReady, setBleManagerIsReady] = useState(false);

  useEffect(() => {
    setBleManagerIsReady(true);
    bleManagerRef.current ??= new BleManager({
      restoreStateIdentifier: 'com.app.ble',
      restoreStateFunction: async _restored => {
        try {
          g.__BLE_SHOULD_START_SCAN__ = true;
        } catch (err) {
          console.warn('Restore callback before JS ready:', err);
        }
      },
    });

    return () => {
      bleManagerRef.current?.destroy();
      bleManagerRef.current = null;
    };
  }, []);

  const bgScanRef = useRef(false);
  const searchBleRef = useRef(false);

  // temp - 디바이스 조회 잘 되나 확인하기 위함

  const actions = {
    stopBleScan: useCallback(
      async (session: number) => {
        console.log(session);
        if (scanSessionRef.current !== session) return;
        if (!bleManagerRef.current) return;
        console.log('stopScanning');
        bgScanRef.current = false;
        searchBleRef.current = false;
        await bleManagerRef.current.stopDeviceScan();
      },
      [bleManagerRef],
    ),
  };

  return (
    <BleContext.Provider
      value={{
        actions,
        state: {
          bleManagerRef,
          scanSessionRef,
          searchBleRef,
          bgScanRef,
          bleManagerIsReady,
        },
      }}
    >
      {children}
    </BleContext.Provider>
  );
};

export const useBleContext = () => useContext(BleContext);
