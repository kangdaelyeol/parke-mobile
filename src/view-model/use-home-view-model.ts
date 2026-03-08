import { useCallback, useState } from 'react'
import { Alert } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { useUserContext } from '@/contexts'
import { bleService, settingService, permissionService } from '@/services'
import { useHomeContext } from '@/contexts/home-context'

export const useHomeViewModel = () => {
  const { cards, user, syncCardList, setCards } = useUserContext()
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
      let intervalId = 0
      ;(async () => {
        const settings = settingService.getSettings()
        if (!settings.active) return
        if (cards.length === 0) return

        const bluetoothPermission =
          await permissionService.ensureBluetoothPermission()

        if (!bluetoothPermission) {
          Alert.alert(
            'Bluetooth 권한 필요',
            'Parke 백그라운드 스캔을 위해 블루투스 권한을 허용해주세요',
          )
          return setScanning(false)
        }

        sub = bleService.getManager()?.onStateChange(state => {
          if (state === 'PoweredOn') {
            bleService.startBackgroundScan({ setCards, cards, user })
            setScanning(true)

            intervalId = setInterval(async () => {
              await bleService.stopScan(nowSession)
              bleService.startBackgroundScan({ setCards, cards, user })
            }, 5000)
            sub?.remove()
          }
        }, true)
      })()

      return () => {
        sub?.remove()
        bleService.stopScan(nowSession)
        clearInterval(intervalId)
        setScanning(false)
      }
    }, [user, cards, setCards, setScanning]),
  )

  return { state: { loading } }
}
