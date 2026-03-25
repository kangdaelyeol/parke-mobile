import { useEffect, useState } from 'react'
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import {
  useCardSettingContext,
  useCardSliderContext,
  useUserContext,
} from '@/contexts'
import { cardService } from '@/services'
import { CardDto } from '@/domain/card'
import { HomeSettingCardViewModel } from '@home/types'
import { extractNumber } from '@/utils'
import { Alert } from 'react-native'

export const useSettingCardViewModel = (
  card: CardDto,
): HomeSettingCardViewModel => {
  const { cardSettingController } = useCardSettingContext()
  const { selectedCardIdx } = useCardSliderContext()
  const { cards, actions: userContextActions } = useUserContext()

  const [title, setTitle] = useState(card.title)
  const [phone, setPhone] = useState(card.phone)
  const [message, setMessage] = useState(card.message)
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
      cardSettingController.hideSetting()
      const res = await cardService.updateCardInfo(
        cards[selectedCardIdx].id,
        title,
        phone,
        message,
      )

      if (!res) {
        Alert.alert('네트워크 오류', '잠시 후 다시 시도해주세요.')
        return
      }
      userContextActions.updateCardInfo(
        cards[selectedCardIdx].id,
        title,
        phone,
        message,
      )
    },
    cancelPress: () => {
      cardSettingController.hideSetting()
    },
    titleInput: (val: string) => setTitle(val),
    messageInput: (val: string) => setMessage(val),
    phoneInput: (val: string) => setPhone(extractNumber(val)),
  }

  return {
    state: {
      title,
      message,
      phone,
    },
    actions,
    animated: {
      optionStyle,
    },
  }
}
