import { useCallback, useState } from 'react'
import { Alert, Linking } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useUserContext, useHomeContext } from '@/contexts'
import { bleService, settingService, permissionService } from '@/services'
import { HomeStackNavigationProp } from '@/navigation/types'

export const useHomeViewModel = () => {
  const {
    cards,
    user,
    syncCardList,
    actions: userContextActions,
  } = useUserContext()
  const [loading, setLoading] = useState(false)
  const { setScanning } = useHomeContext()
  const navigation = useNavigation<HomeStackNavigationProp>()

  useFocusEffect(
    useCallback(() => {
      if (!user?.id) return
      ;(async () => {
        setLoading(true)
        const syncRes = await syncCardList()
        if (!syncRes.status) {
          Alert.alert(syncRes.message)
          return navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
        }
        setLoading(false)
      })()
    }, [syncCardList, user?.id, navigation]),
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
              refreshStateSession: userContextActions.refreshStateSession,
              onCardPhoneChange: userContextActions.updateCardPhone,
              onDBError: (message: string) => {
                Alert.alert(message)
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
    }, [user, cards, setScanning, userContextActions]),
  )

  return { state: { loading } }
}
