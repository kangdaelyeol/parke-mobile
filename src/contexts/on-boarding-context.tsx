import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';
import { SharedValue, useSharedValue } from 'react-native-reanimated';

export interface OnBoardingContextProps {
  pageIdx: number;
  setPageIdx: React.Dispatch<React.SetStateAction<number>>;
  sliderTranslateX: SharedValue<number>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  hasSeenOnBoarding: boolean;
  setHasSeenOnBoarding: React.Dispatch<React.SetStateAction<boolean>>;
}

const onBoardingContext = createContext<OnBoardingContextProps>(
  {} as OnBoardingContextProps,
);

export const OnBoardingContextProvider = ({ children }: PropsWithChildren) => {
  const sliderTranslateX = useSharedValue<number>(0);
  const [pageIdx, setPageIdx] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasSeenOnBoarding, setHasSeenOnBoarding] = useState(false);

  const initialValue = {
    pageIdx,
    setPageIdx,
    sliderTranslateX,
    loading,
    setLoading,
    hasSeenOnBoarding,
    setHasSeenOnBoarding,
  };

  return (
    <onBoardingContext.Provider value={initialValue}>
      {children}
    </onBoardingContext.Provider>
  );
};

export const useOnBoardingContext = () => useContext(onBoardingContext);
