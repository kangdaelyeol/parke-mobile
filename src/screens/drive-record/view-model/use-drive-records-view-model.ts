import { useCallback, useState } from 'react'
import { Alert } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useUserContext } from '@/contexts'
import { DEFAULT_CARD_CUSTOM } from '@/domain/card'
import { DriveRecordDto } from '@/domain/drive'
import { DriveRecordsStackNavigationProp } from '@/navigation/types'
import { driveRecordService } from '@/services'
import { DriveRecordsViewModel } from '@/screens/drive-record/types'

export const useDriveRecordsViewModel = (
  cardId: string,
): DriveRecordsViewModel => {
  const navigation = useNavigation<DriveRecordsStackNavigationProp>()
  const { user, cards } = useUserContext()
  const card = cards.find(c => c.id === cardId)
  const [records, setRecords] = useState<DriveRecordDto[]>([])
  const [loading, setLoading] = useState(true)

  // 상세에서 기록을 지우고 돌아올 수 있으므로 화면에 올 때마다 다시 불러온다
  useFocusEffect(
    useCallback(() => {
      if (!user) return
      let active = true
      ;(async () => {
        const res = await driveRecordService.listByCard(user.id, cardId)
        if (!active) return
        setLoading(false)
        if (!res.status) return Alert.alert(res.message)
        setRecords(res.payload)
      })()
      return () => {
        active = false
      }
    }, [user, cardId]),
  )

  return {
    state: {
      cardTitle: card?.title ?? '',
      accent: card?.custom.accent ?? DEFAULT_CARD_CUSTOM.accent,
      records,
      loading,
    },
    actions: {
      backPress: () => navigation.goBack(),
      recordPress: record => navigation.navigate('DriveRecord', { record }),
    },
  }
}
