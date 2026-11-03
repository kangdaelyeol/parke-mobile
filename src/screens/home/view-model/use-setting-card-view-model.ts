import { useState } from 'react'
import { Alert } from 'react-native'
import { useCardSettingContext, useCardSliderContext } from '@home/contexts'
import { useUserContext } from '@/contexts'
import { cardService } from '@/services'
import { CardState } from '@/services/types'
import {
  CARD_MESSAGE_MAX_LENGTH,
  CardLayout,
  CardTheme,
  clampCardScale,
  isCardAccent,
} from '@/domain/card'
import { HomeSettingCardViewModel } from '@home/types'
import { extractNumber, isEmail } from '@/utils'

export const useSettingCardViewModel = (
  card: CardState,
): HomeSettingCardViewModel => {
  const { cardSettingController } = useCardSettingContext()
  const { selectedCardIdx } = useCardSliderContext()
  const { cards, actions: userContextActions } = useUserContext()
  // 카드 이메일: 공동 소유자끼리 공유하지만 공개 카드 노드가 아닌 cardPrivate에 저장된다
  const savedEmail = card.email

  const [title, setTitle] = useState(card.title)
  const [phone, setPhone] = useState(card.phone)
  const [message, setMessage] = useState(card.custom.message)
  const [theme, setTheme] = useState(card.theme)
  const [layout, setLayout] = useState(card.layout)
  const [accent, setAccent] = useState(card.custom.accent)
  const [scale, setScale] = useState(card.custom.scale)
  const [email, setEmail] = useState(savedEmail)
  const actions = {
    savePress: async () => {
      if (!isCardAccent(accent))
        return Alert.alert('강조 색상을 #RRGGBB 형식으로 입력해주세요.')
      const nextEmail = email.trim()
      if (nextEmail && !isEmail(nextEmail))
        return Alert.alert('이메일 주소를 확인해주세요.')

      const cardId = cards[selectedCardIdx].id
      const info = {
        title,
        phone,
        theme,
        layout,
        custom: { accent, scale, message },
      }

      cardSettingController.hideSetting()
      const res = await cardService.updateCardInfo(cardId, info)

      if (!res.status) {
        Alert.alert(res.message)
        return
      }
      userContextActions.updateCardInfo(cardId, info)

      if (nextEmail === savedEmail) return
      const emailRes = await cardService.updateEmail(cardId, nextEmail)
      if (!emailRes.status) return Alert.alert(emailRes.message)
      userContextActions.updateCardEmail(cardId, nextEmail)
    },
    cancelPress: () => {
      cardSettingController.hideSetting()
    },
    titleInput: (val: string) => setTitle(val),
    messageInput: (val: string) =>
      setMessage(val.slice(0, CARD_MESSAGE_MAX_LENGTH)),
    phoneInput: (val: string) => setPhone(extractNumber(val)),
    emailInput: (val: string) => setEmail(val),
    themePress: (val: CardTheme) => setTheme(val),
    layoutPress: (val: CardLayout) => setLayout(val),
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
      layout,
      accent,
      scale,
      email,
    },
    actions,
    animated: {},
  }
}
