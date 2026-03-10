import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

interface CardSettingContext {
  sliderStyle: StyleProp<ViewStyle>
  cardSettingController: {
    showSetting: (_: number) => void
    hideSetting: () => void
  }
  settingCard: number
  setSettingCard: React.Dispatch<React.SetStateAction<number>>
}

const cardSettingContext = createContext<CardSettingContext>(
  {} as CardSettingContext,
)
const SLIDER_MARGIN_TOP_ACTIVE = 10
const SLIDER_MARGIN_TOP_INACTIVE = 300

export const CardSettingProvider = ({ children }: PropsWithChildren) => {
  const sliderMarginTop = useSharedValue(SLIDER_MARGIN_TOP_INACTIVE)

  const [settingCard, setSettingCard] = useState(-1)

  const cardSettingController = {
    showSetting: (idx: number) => {
      setSettingCard(idx)
      sliderMarginTop.value = withTiming(SLIDER_MARGIN_TOP_ACTIVE, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      })
    },
    hideSetting: () => {
      setSettingCard(-1)
      sliderMarginTop.value = withTiming(SLIDER_MARGIN_TOP_INACTIVE, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      })
    },
  }

  const sliderStyle = useAnimatedStyle(() => {
    return {
      marginVertical: sliderMarginTop.value,
    }
  })

  return (
    <cardSettingContext.Provider
      value={{
        cardSettingController,
        settingCard,
        setSettingCard,
        sliderStyle,
      }}
    >
      {children}
    </cardSettingContext.Provider>
  )
}

export const useCardSettingContext = () => useContext(cardSettingContext)
