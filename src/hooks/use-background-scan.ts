import { useEffect, useRef } from 'react'
import { Alert, AppState, Linking } from 'react-native'
import { useUserContext } from '@/contexts'
import { bleService } from '@/services'
import { usePhoneChangePrompt } from './use-phone-change-prompt'

// 로그인 상태와 카드 목록에 맞춰 앱 전역에서 백그라운드 스캔을 켜고 끈다.
// 화면 이동과 관계없이 스캔이 유지된다.
export const useBackgroundScan = () => {
  const { user, cards, actions: userContextActions } = useUserContext()
  const promptPhoneChange = usePhoneChangePrompt()
  const permissionAlerted = useRef(false)

  useEffect(() => {
    if (!user?.id) {
      bleService.setBackgroundContext(null)
      bleService.refreshBackgroundScan()
      return
    }

    bleService.setBackgroundContext({
      cards,
      user,
      refreshStateSession: userContextActions.refreshStateSession,
      onCardPhoneChange: userContextActions.updateCardPhone,
      onPhoneChangeRequest: promptPhoneChange,
      onPermissionDenied: () => {
        // 앱 실행 중 한 번만 안내한다
        if (permissionAlerted.current) return
        permissionAlerted.current = true
        Alert.alert(
          'Bluetooth 권한 필요',
          'Parke 백그라운드 스캔을 위해 블루투스 권한을 허용해주세요',
          [
            { text: '취소', style: 'destructive' },
            { text: '설정으로 이동', onPress: () => Linking.openSettings() },
          ],
        )
      },
      onDBError: message => Alert.alert(message),
      onError: e => {
        console.log(e)
        Alert.alert(`[BLE] scan handler error: ${e}`)
      },
    })
    bleService.refreshBackgroundScan()
  }, [user, cards, userContextActions, promptPhoneChange])

  // 설정 앱에서 권한/블루투스를 바꾸고 돌아온 경우 다시 확인한다
  useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') bleService.refreshBackgroundScan()
    })
    return () => sub.remove()
  }, [])
}
