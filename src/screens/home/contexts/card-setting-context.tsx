import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { StyleProp, useWindowDimensions, ViewStyle } from 'react-native'
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

export const CardSettingProvider = ({ children }: PropsWithChildren) => {
  const sliderMarginTopactive = 10
  let sliderMargitTopInactive = 300
  const { width } = useWindowDimensions()
  const isSmall = width < 400

  if (isSmall) {
    sliderMargitTopInactive = 250
  }

  const sliderMarginTop = useSharedValue(sliderMargitTopInactive)
  // 수정 모드에서는 카드가 위로 올라가며 사라지고, 그 자리를 '카드 수정' 막대가 대신한다
  const sliderOpacity = useSharedValue(1)

  const [settingCard, setSettingCard] = useState(-1)

  const cardSettingController = {
    showSetting: (idx: number) => {
      setSettingCard(idx)
      sliderMarginTop.value = withTiming(sliderMarginTopactive, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      })
      sliderOpacity.value = withTiming(0, { duration: 250 })
    },
    hideSetting: () => {
      setSettingCard(-1)
      sliderMarginTop.value = withTiming(sliderMargitTopInactive, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      })
      sliderOpacity.value = withTiming(1, { duration: 400 })
    },
  }

  const sliderStyle = useAnimatedStyle(() => {
    return {
      marginVertical: sliderMarginTop.value,
      opacity: sliderOpacity.value,
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
