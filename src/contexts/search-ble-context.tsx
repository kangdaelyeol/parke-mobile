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
    rssi: string;
    detected: boolean;
  };
  actions: {
    setRssi: React.Dispatch<React.SetStateAction<string>>;
  };
}

const searchBLEContext = createContext({} as SearchBLEContextValue);

export const SearchBleProvider = ({ children }: PropsWithChildren) => {
  const { setTime, setHepticOption } = useHeptic();

  const [detected, setDetected] = useState(false);
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
        state: { detected, rssi },
        actions: {
          setRssi,
        },
      }}
    >
      {children}
    </searchBLEContext.Provider>
  );
};

export const useSearchBleContext = () => useContext(searchBLEContext);
