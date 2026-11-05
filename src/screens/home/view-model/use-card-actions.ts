import { useState } from 'react'
import { Alert, Linking } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { HomeStackNavigationProp } from '@/navigation/types'
import { useCardSettingContext, useCardSliderContext } from '@home/contexts'
import { useUserContext } from '@/contexts'
import { HomeCardActions } from '@home/types'
import { cardService } from '@/services'
import { PARKE_WEB_URL } from '@/constants'

// 카드 하나의 기능(주행, 기록, 수정, 삭제, 자동감지, 번호 변경 등).
// 카드와 글래스 홈의 카드 정보 판이 함께 쓴다
export const useCardActions = (idx: number): HomeCardActions => {
  const navigation = useNavigation<HomeStackNavigationProp>()
  const { isSetting, cardSettingController } = useCardSettingContext()
  const { selectedCardIdx, sliderController, isSliding } =
    useCardSliderContext()
  const { user, cards, actions: userContextActions } = useUserContext()
  const [loading, setLoading] = useState(false)

  // 이 훅이 담당하는 카드 (바텀시트는 선택되지 않은 카드에서도 열 수 있다)
  const card = cards[idx]
  const isSelected = idx === selectedCardIdx

  const actions = {
    drivePress: () => {
      if (!card) return
      navigation.navigate('Drive', { cardId: card.id })
    },
    cardPress: () => {
      if (isSetting || isSliding()) return

      if (!isSelected) sliderController.goToIdx(idx)
    },
    recordsPress: () => {
      if (!card) return
      navigation.navigate('DriveRecords', { cardId: card.id })
    },
    editPress: () => {
      if (!isSelected) sliderController.goToIdx(idx)
      cardSettingController.showSetting(idx)
    },
    deletePress: (onDeleted?: () => void) => {
      if (!user || !card) return
      Alert.alert('Parke 삭제', '삭제하시겠습니까? - (재등록 가능)', [
        {
          text: '삭제',
          onPress: async () => {
            setLoading(true)

            const cardDeleteRes = await cardService.leaveCard(card)

            if (!cardDeleteRes.status) {
              Alert.alert(cardDeleteRes.message)
              return setLoading(false)
            }

            onDeleted?.()
            userContextActions.deleteCard(card.id)
            setLoading(false)
          },
        },
        { text: '취소', style: 'cancel' },
      ])
    },
    previewPress: async () => {
      if (!card) return
      const url = PARKE_WEB_URL + card.id

      const supported = await Linking.canOpenURL(url)
      if (!supported)
        return Alert.alert('웹 사이트를 열 수 없습니다. 확인해주세요')
      await Linking.openURL(url)
    },
    scanChangePress: () => {
      if (!card) return
      cardService.updateScan(card.deviceId, !card.scan)
      userContextActions.setCardScan(card.id, !card.scan)
    },
    changePhonePress: async () => {
      if (!user || !card) return
      const { phone } = user
      setLoading(true)
      const res = await cardService.updatePhone(card.id, phone)
      if (!res.status) {
        Alert.alert(res.message)
        return setLoading(false)
      }
      setLoading(false)
      userContextActions.updateCardPhone(card.id, phone)
    },
  }

  return { loading, isSetting, isSelected, actions }
}
