import { permissionService } from '@/services'
import { useEffect } from 'react'
import { Alert } from 'react-native'
import { useSearchBleContext, useUserContext } from '@/contexts'
import { SearchBleScreenViewModel } from '@search-ble/types'
import { useNavigation } from '@react-navigation/native'
import { SearchBleStackNavigationProp } from '@/navigation/types'
import { bleService } from '@/services'

export const useSearchBleViewModel = (): SearchBleScreenViewModel => {
  const {
    state: searchBleState,
    actions: { setRssi },
  } = useSearchBleContext()
  const { cards } = useUserContext()

  const navigation = useNavigation<SearchBleStackNavigationProp>()

  useEffect(() => {
    let sub: { remove: () => void } | undefined
    bleService.updateSession()
    const nowSession = bleService.getSession()
    ;(async () => {
      const bluetoothPermission =
        await permissionService.ensureBluetoothPermission()
      if (!bluetoothPermission) {
        Alert.alert(
          'Bluetooth 권한 필요',
          'Parke 스캔을 위해 설정에서 블루투스 권한을 허용해주세요',
        )
        return navigation.goBack()
      }

      sub = bleService.getManager()?.onStateChange(state => {
        console.log(state)
        if (state === 'PoweredOn') {
          bleService.startSearchBle({
            navigation,
            setRssi,
            cards,
          })
          sub?.remove()
        }
      }, true)
    })()

    return () => {
      sub?.remove()
      bleService.stopScan(nowSession)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards])

  return {
    state: {
      rssi: searchBleState.rssi,
    },
    actions: {},
  }
}
