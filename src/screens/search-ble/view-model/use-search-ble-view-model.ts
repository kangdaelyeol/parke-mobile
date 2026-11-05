import { permissionService } from '@/services'
import { useEffect } from 'react'
import { Alert, Linking } from 'react-native'
import { useSearchBleContext } from '@search-ble/contexts'
import { useUserContext } from '@/contexts'
import { useNavigation } from '@react-navigation/native'
import { SearchBleStackNavigationProp } from '@/navigation/types'
import { bleService } from '@/services'
import { logger } from '@/utils'

export const useSearchBleViewModel = () => {
  const {
    actions: { setRssi },
  } = useSearchBleContext()
  const { cards } = useUserContext()

  const navigation = useNavigation<SearchBleStackNavigationProp>()

  useEffect(() => {
    let sub: { remove: () => void } | undefined
    ;(async () => {
      const bluetoothPermission =
        await permissionService.ensureBluetoothPermission()
      if (!bluetoothPermission) {
        Alert.alert(
          'Bluetooth 권한 필요',
          'Parke 스캔을 위해 설정에서 블루투스 권한을 허용해주세요',
          [
            { text: '취소', style: 'destructive' },
            { text: '설정으로 이동', onPress: () => Linking.openSettings() },
          ],
        )
        return navigation.goBack()
      }

      sub = bleService.getManager().onStateChange(state => {
        if (state === 'PoweredOn') {
          bleService.startSearchBle({
            cards,
            onError: e => {
              logger.error('[SearchBLE] register failed', e)
              Alert.alert(
                '기기와 연결하지 못했어요',
                '기기를 휴대폰 가까이 두고 다시 시도해주세요.',
              )
              navigation.goBack()
            },
            onDuplicated: () => {
              Alert.alert('이미 등록된 장치입니다.')
              navigation.goBack()
            },
            onDeviceFound: (deviceId: string) => {
              navigation.replace('ScanComplete', { value: deviceId })
            },
            onRssiChange: rssi => {
              setRssi(rssi)
            },
          })
          sub?.remove()
        }
      }, true)
    })()

    return () => {
      sub?.remove()
      bleService.stopSearchBle()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards])
}
