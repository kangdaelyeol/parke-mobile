import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import {
  useCardSettingContext,
  useCardSliderContext,
  useUserContext,
} from '@/contexts'
import { HomeCardViewModel } from '@home/types'
import { useEffect, useRef, useState } from 'react'
import { Alert, Linking } from 'react-native'
import { cardService } from '@/services'
import { PARKE_WEB_URL } from '@/constants'
import { BottomSheetModal } from '@gorhom/bottom-sheet'

export const useCardViewModel = (idx: number): HomeCardViewModel => {
  const { settingCard, cardSettingController } = useCardSettingContext()
  const { selectedCardIdx, sliderController } = useCardSliderContext()
  const { user, setCards, cards, setUser } = useUserContext()
  const [loading, setLoading] = useState(false)
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const selectedCard = cards[selectedCardIdx]
  const isSelected = idx === selectedCardIdx

  const cardOpacity = useSharedValue(isSelected ? 1 : 0)
  const cardTranslateY = useSharedValue(isSelected ? 1 : 0)

  const scanOnDotOpacity = useSharedValue(1)

  useEffect(() => {
    scanOnDotOpacity.value = withRepeat(
      withTiming(0, { duration: 1000, easing: Easing.out(Easing.ease) }),
      -1,
      true,
    )
  }, [scanOnDotOpacity])

  const scanOnDotStyle = useAnimatedStyle(() => ({
    opacity: scanOnDotOpacity.value * 0.6 + 0.4,
  }))

  useEffect(() => {
    cardOpacity.value = withTiming(isSelected ? 1 : 0, { duration: 200 })
    cardTranslateY.value = withTiming(isSelected ? 1 : 0, {
      duration: 150,
      easing: Easing.out(Easing.cubic),
    })
  }, [cardOpacity, cardTranslateY, isSelected])

  const cardStyle = useAnimatedStyle(() => {
    return {
      opacity: 0.4 + 0.6 * cardOpacity.value,
      transform: [
        {
          translateY: (1 - cardTranslateY.value) * 15,
        },
      ],
    }
  })

  const actions = {
    cardPress: () => {
      if (settingCard !== -1) return

      if (!isSelected) sliderController.goToIdx(idx)
    },
    editPress: () => {
      cardSettingController.showSetting(selectedCardIdx)
    },
    deletePress: () => {
      Alert.alert('Parke 삭제', '삭제하시겠습니까? - (재등록 가능)', [
        {
          text: '삭제',
          onPress: async () => {
            setLoading(true)

            const filteredCardList = cards.filter(
              card => card.id !== selectedCard.id,
            )
            const cardDeleteRes = await cardService.delete(
              selectedCard.id,
              user.id,
            )

            if (!cardDeleteRes) {
              Alert.alert('오류가 발생했습니다. 다시 시도해주세요.')
              return setLoading(false)
            }

            setLoading(false)
            setCards(filteredCardList)
            setUser(prev => ({
              ...prev,
              cardIdList: filteredCardList.map(c => c.id),
            }))
          },
        },
        { text: '취소', style: 'cancel' },
      ])
    },
    previewPress: async () => {
      const url = PARKE_WEB_URL + selectedCard.id

      const supported = await Linking.canOpenURL(url)
      if (!supported)
        return Alert.alert('웹 사이트를 열 수 없습니다. 확인해주세요')
      await Linking.openURL(url)
    },
    scanChangePress: async () => {
      setLoading(true)
      const res = await cardService.updateScan(
        selectedCard.id,
        !selectedCard.scan,
      )
      if (!res) {
        Alert.alert('오류가 발생했습니다. 다시 시도해주세요.')
        return setLoading(false)
      }
      setLoading(false)
      setCards(prev =>
        prev.map(card =>
          card.id !== selectedCard.id
            ? { ...card }
            : { ...card, scan: !card.scan },
        ),
      )
    },
    changePhonePress: async () => {
      const { phone } = user
      setLoading(true)
      const res = await cardService.updatePhone(selectedCard.id, phone)
      if (!res) {
        Alert.alert('오류가 발생했습니다. 다시 시도해주세요.')
        return setLoading(false)
      }
      setLoading(false)
      setCards(prev =>
        prev.map(card =>
          card.id !== selectedCard.id ? { ...card } : { ...card, phone },
        ),
      )
    },
    morePress: () => {
      bottomSheetModalRef.current?.present()
    },
  }

  return {
    state: {
      loading,
      settingCard,
      bottomSheetModalRef,
    },
    animated: { cardStyle, scanOnDotStyle },
    actions,
  }
}
