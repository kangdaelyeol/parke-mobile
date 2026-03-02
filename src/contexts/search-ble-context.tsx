import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import useHeptic from '@/hooks/use-heptic';

interface SearchBLEContextValue {
  state: {
    devices: any[];
    rssi: string;
    detected: boolean;
  };
  actions: {
    setDevices: React.Dispatch<React.SetStateAction<any[]>>;
    setRssi: React.Dispatch<React.SetStateAction<string>>;
  };
}

const searchBLEContext = createContext({} as SearchBLEContextValue);

export const SearchBleProvider = ({ children }: PropsWithChildren) => {
  const { setTime, setHepticOption } = useHeptic();

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

  return (
    <searchBLEContext.Provider
      value={{
        state: { devices, detected, rssi },
        actions: {
          setDevices,
          setRssi,
        },
      }}
    >
      {children}
    </searchBLEContext.Provider>
  );
};

export const useSearchBleContext = () => useContext(searchBLEContext);
