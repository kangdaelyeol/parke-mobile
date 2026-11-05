import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { SharedValue, useSharedValue } from 'react-native-reanimated'

export interface OnBoardingContextValue {
  pageIdx: number
  setPageIdx: React.Dispatch<React.SetStateAction<number>>
  sliderTranslateX: SharedValue<number>
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  hasSeenOnBoarding: boolean
  setHasSeenOnBoarding: React.Dispatch<React.SetStateAction<boolean>>
}

const onBoardingContext = createContext<OnBoardingContextValue>(
  {} as OnBoardingContextValue,
)

export const OnBoardingContextProvider = ({ children }: PropsWithChildren) => {
  const sliderTranslateX = useSharedValue<number>(0)
  const [pageIdx, setPageIdx] = useState(1)
  const [loading, setLoading] = useState(true)
  const [hasSeenOnBoarding, setHasSeenOnBoarding] = useState(false)

  const initialValue = {
    pageIdx,
    setPageIdx,
    sliderTranslateX,
    loading,
    setLoading,
    hasSeenOnBoarding,
    setHasSeenOnBoarding,
  }

  return (
    <onBoardingContext.Provider value={initialValue}>
      {children}
    </onBoardingContext.Provider>
  )
}

export const useOnBoardingContext = () => useContext(onBoardingContext)
