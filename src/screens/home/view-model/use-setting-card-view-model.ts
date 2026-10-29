import { useState } from 'react'
import { Alert } from 'react-native'
import { useCardSettingContext, useCardSliderContext } from '@home/contexts'
import { useUserContext } from '@/contexts'
import { cardService, userService } from '@/services'
import {
  CARD_MESSAGE_MAX_LENGTH,
  CardDto,
  CardLayout,
  CardTheme,
  clampCardScale,
  isCardAccent,
} from '@/domain/card'
import { HomeSettingCardViewModel } from '@home/types'
import { extractNumber, isEmail } from '@/utils'

export const useSettingCardViewModel = (
  card: CardDto,
): HomeSettingCardViewModel => {
  const { cardSettingController } = useCardSettingContext()
  const { selectedCardIdx } = useCardSliderContext()
  const { user, cards, actions: userContextActions } = useUserContext()
  // 운행 기록 이메일은 카드가 아닌 내 계정에 카드별로 저장한다 (공동 소유자끼리 공유하지 않음)
  const savedEmail = user?.reportEmails?.[card.id] ?? ''

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

      if (!user || nextEmail === savedEmail) return
      const emailRes = await userService.updateReportEmail(
        user.id,
        cardId,
        nextEmail,
      )
      if (!emailRes.status) return Alert.alert(emailRes.message)
      userContextActions.setReportEmail(cardId, nextEmail)
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
