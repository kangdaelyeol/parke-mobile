import { useCallback, useState } from 'react'
import { Alert, Linking } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { useUserContext, useHomeContext } from '@/contexts'
import { bleService, settingService, permissionService } from '@/services'

export const useHomeViewModel = () => {
  const { cards, user, syncCardList, setCards, refreshStateSession } =
    useUserContext()
  const [loading, setLoading] = useState(false)
  const { setScanning } = useHomeContext()

  useFocusEffect(
    useCallback(() => {
      if (!user?.id) return
      ;(async () => {
        setLoading(true)
        await syncCardList()
        setLoading(false)
      })()
    }, [syncCardList, user?.id]),
  )

  useFocusEffect(
    useCallback(() => {
      if (!user?.id) return

      if (user.phone.trim() === '') {
        Alert.alert(
          '전화번호 등록 필요',
          '백그라운드 장치 스캔을 위해서는 전화번호 등록이 필요합니다.',
        )
        return
      }

      bleService.updateSession()
      const nowSession = bleService.getSession()
      let sub: { remove: () => void } | undefined
      ;(async () => {
        const settings = settingService.getSettings()
        if (!settings.active || cards.length === 0) return setScanning(false)

        const bluetoothPermission =
          await permissionService.ensureBluetoothPermission()

        if (!bluetoothPermission) {
          Alert.alert(
            'Bluetooth 권한 필요',
            'Parke 백그라운드 스캔을 위해 블루투스 권한을 허용해주세요',
            [
              { text: '취소', style: 'destructive' },
              { text: '설정으로 이동', onPress: () => Linking.openSettings() },
            ],
          )
          return setScanning(false)
        }

        sub = bleService.getManager()?.onStateChange(state => {
          if (state === 'PoweredOn') {
            bleService.startBackgroundScan({
              cards,
              user,
              refreshStateSession,
              onCardChange: (cardId: string) => {
                setCards(prev => {
                  const newCards = [...prev]
                  const index = newCards.findIndex(c => c.id === cardId)
                  if (index === -1) return prev
                  newCards[index].phone = user.phone
                  return newCards
                })
              },
              onDBError: () => {
                Alert.alert('정보 업데이트 중 네트워크에 문제가 발생했습니다.')
              },
              onError: (e: any) => {
                console.log(e)
                Alert.alert(`[BLE] scan handler error: ${e}`)
              },
            })
            setScanning(true)

            sub?.remove()
          }
        }, true)
      })()

      return () => {
        sub?.remove()
        bleService.stopScan(nowSession)
        setScanning(false)
      }
    }, [user, cards, setCards, setScanning, refreshStateSession]),
  )

  return { state: { loading } }
}
