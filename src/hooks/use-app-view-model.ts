import { useEffect } from 'react'
import { Alert, AppState } from 'react-native'
import Orientation from 'react-native-orientation-locker'
import DeviceInfo from 'react-native-device-info'
import notifee from '@notifee/react-native'
import {
  cacheService,
  bleCacheService,
  driveSessionService,
  permissionService,
  phoneChangeService,
} from '@/services'
import { useUserContext } from '@/contexts'
import { usePhoneChangePrompt } from './use-phone-change-prompt'
import { useBackgroundScan } from './use-background-scan'

export const useAppViewModel = () => {
  const { actions: userContextActions } = useUserContext()
  const promptPhoneChange = usePhoneChangePrompt()
  useBackgroundScan()

  useEffect(() => {
    ;(async () => {
      await permissionService.setupNotifications()
    })()
    cacheService.ensureInitialized()
    cacheService.ensureTodayDashBoardCache()

    if (DeviceInfo.isTablet()) {
      Orientation.unlockAllOrientations()
    } else {
      Orientation.lockToPortrait()
    }
  }, [])

  useEffect(() => {
    // 앱이 켜져 있을 때 알림 응답 (백그라운드 응답은 index.js)
    const unsub = notifee.onForegroundEvent(async event => {
      if (driveSessionService.handleNotificationEvent(event)) return
      const result = await phoneChangeService.handleNotificationEvent(event)
      if (result?.type === 'confirmed')
        userContextActions.updateCardPhone(result.cardId, result.phone)
      if (result?.type === 'failed') Alert.alert(result.message)
    })

    return () => unsub()
  }, [userContextActions])

  // 외부에서 포그라운드로 다시 들어가는 경우
  useEffect(() => {
    const sub = AppState.addEventListener('change', async state => {
      if (state !== 'active') return
      cacheService.ensureTodayDashBoardCache()

      // 응답을 기다리는 요청은 응답할 때 대기 목록에서 지워진다
      bleCacheService.getAlertPendingList().forEach(promptPhoneChange)
    })

    return () => sub.remove()
  }, [promptPhoneChange])
}
