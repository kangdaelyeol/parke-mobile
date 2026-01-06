import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { SharedValue, useSharedValue } from 'react-native-reanimated';
import { cache } from '@/storage';

export interface OnBoardContextValueType {
  pageIdx: number;
  setPageIdx: React.Dispatch<React.SetStateAction<number>>;
  sliderTranslateX: SharedValue<number>;
  loading: boolean;
  hasSeenOnBoarding: boolean;
  setHasSeenOnBoarding: React.Dispatch<React.SetStateAction<boolean>>;
}

const OnBoardContext = createContext<OnBoardContextValueType>(
  {} as OnBoardContextValueType,
);

export const OnBoardContextProvider = ({ children }: PropsWithChildren) => {
  const sliderTranslateX = useSharedValue<number>(1);
  const [pageIdx, setPageIdx] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasSeenOnBoarding, setHasSeenOnBoarding] = useState(false);

  useEffect(() => {
    const hasSeen = cache.getHasSeenOnBoarding();

    setHasSeenOnBoarding(hasSeen);
    setLoading(false);
  }, []);

  const initialValue: OnBoardContextValueType = {
    pageIdx,
    setPageIdx,
    sliderTranslateX,
    loading,
    hasSeenOnBoarding,
    setHasSeenOnBoarding,
  };

  return (
    <OnBoardContext.Provider value={initialValue}>
      {children}
    </OnBoardContext.Provider>
  );
};

export const useOnBoard = () => useContext(OnBoardContext);
