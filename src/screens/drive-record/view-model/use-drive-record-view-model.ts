import { useEffect, useRef, useState } from 'react'
import { Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useUserContext } from '@/contexts'
import { DEFAULT_CARD_CUSTOM } from '@/domain/card'
import { DriveRecordDto } from '@/domain/drive'
import { DriveRecordStackNavigationProp } from '@/navigation/types'
import { driveRecordService } from '@/services'
import { DriveMapHandle, GeoPoint } from '@/screens/drive/types'
import { DriveRecordViewModel } from '@/screens/drive-record/types'

export const useDriveRecordViewModel = (
  record: DriveRecordDto,
): DriveRecordViewModel => {
  const navigation = useNavigation<DriveRecordStackNavigationProp>()
  const { user, cards } = useUserContext()
  const card = cards.find(c => c.id === record.cardId)
  const [points, setPoints] = useState<GeoPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const mapRef = useRef<DriveMapHandle>(null)

  // 경로는 상세에서만 따로 불러온다
  useEffect(() => {
    if (!user) return
    let active = true
    ;(async () => {
      const res = await driveRecordService.getPath(user.id, record.id)
      if (!active) return
      setLoading(false)
      if (!res.status) return Alert.alert(res.message)
      setPoints(
        res.payload.map(([latitude, longitude]) => ({
          latitude,
          longitude,
          timestamp: 0,
          speed: null,
        })),
      )
    })()
    return () => {
      active = false
    }
  }, [user, record.id])

  return {
    state: {
      record,
      accent: card?.custom.accent ?? DEFAULT_CARD_CUSTOM.accent,
      points,
      loading,
      deleting,
      mapRef,
    },
    actions: {
      backPress: () => navigation.goBack(),
      deletePress: () => {
        if (!user || deleting) return
        Alert.alert(
          '주행 기록 삭제',
          '이 주행 기록(경로 포함)을 삭제할까요? 삭제한 기록은 복구할 수 없습니다.',
          [
            { text: '취소', style: 'cancel' },
            {
              text: '삭제',
              style: 'destructive',
              onPress: async () => {
                setDeleting(true)
                const res = await driveRecordService.remove(
                  user.id,
                  record.cardId,
                  record.id,
                )
                setDeleting(false)
                if (!res.status) return Alert.alert(res.message)
                navigation.goBack()
              },
            },
          ],
        )
      },
    },
  }
}
