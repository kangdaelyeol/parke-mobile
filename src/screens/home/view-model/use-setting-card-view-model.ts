import { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useCardSettingContext, useCardSliderContext } from '@home/contexts'
import { useUserContext } from '@/contexts'
import { cardService } from '@/services'
import {
  CARD_MESSAGE_MAX_LENGTH,
  CardDto,
  CardTheme,
  clampCardScale,
  isCardAccent,
} from '@/domain/card'
import { HomeSettingCardViewModel } from '@home/types'
import { extractNumber } from '@/utils'

export const useSettingCardViewModel = (
  card: CardDto,
): HomeSettingCardViewModel => {
  const { cardSettingController } = useCardSettingContext()
  const { selectedCardIdx } = useCardSliderContext()
  const { cards, actions: userContextActions } = useUserContext()

  const [title, setTitle] = useState(card.title)
  const [phone, setPhone] = useState(card.phone)
  const [message, setMessage] = useState(card.custom.message)
  const [theme, setTheme] = useState(card.theme)
  const [accent, setAccent] = useState(card.custom.accent)
  const [scale, setScale] = useState(card.custom.scale)
  const opacityVal = useSharedValue(0)

  useEffect(() => {
    opacityVal.value = withTiming(1, {
      duration: 400,
    })
  }, [opacityVal])

  const optionStyle = useAnimatedStyle(() => ({
    opacity: opacityVal.value,
  }))

  const actions = {
    savePress: async () => {
      if (!isCardAccent(accent))
        return Alert.alert('강조 색상을 #RRGGBB 형식으로 입력해주세요.')

      const cardId = cards[selectedCardIdx].id
      const info = { title, phone, theme, custom: { accent, scale, message } }

      cardSettingController.hideSetting()
      const res = await cardService.updateCardInfo(cardId, info)

      if (!res.status) {
        Alert.alert(res.message)
        return
      }
      userContextActions.updateCardInfo(cardId, info)
    },
    cancelPress: () => {
      cardSettingController.hideSetting()
    },
    titleInput: (val: string) => setTitle(val),
    messageInput: (val: string) =>
      setMessage(val.slice(0, CARD_MESSAGE_MAX_LENGTH)),
    phoneInput: (val: string) => setPhone(extractNumber(val)),
    themePress: (val: CardTheme) => setTheme(val),
    accentInput: (val: string) =>
      setAccent('#' + val.replace(/[^0-9a-fA-F]/g, '').slice(0, 6)),
    scaleChange: (val: number) => setScale(clampCardScale(val)),
  }

  return {
    state: {
      title,
      message,
      phone,
      theme,
      accent,
      scale,
    },
    actions,
    animated: {
      optionStyle,
    },
  }
}
