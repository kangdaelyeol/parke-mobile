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
              setCards,
              cards,
              user,
              refreshStateSession,
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
