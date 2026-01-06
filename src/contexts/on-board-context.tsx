import React, { createContext, PropsWithChildren, useState } from 'react';
import { SharedValue, useSharedValue } from 'react-native-reanimated';

export interface OnBoardContextValueType {
  pageIdx: number;
  setPageIdx: React.Dispatch<React.SetStateAction<number>>;
  sliderTranslateX: SharedValue<number>;
}

export const OnBoardContext = createContext<OnBoardContextValueType>(
  {} as OnBoardContextValueType,
);

export const OnBoardContextProvider = ({ children }: PropsWithChildren) => {
  const sliderTranslateX = useSharedValue<number>(1);
  const [pageIdx, setPageIdx] = useState(1);

  const initialValue: OnBoardContextValueType = {
    pageIdx,
    setPageIdx,
    sliderTranslateX,
  };

  return (
    <OnBoardContext.Provider value={initialValue}>
      {children}
    </OnBoardContext.Provider>
  );
};
