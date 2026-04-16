import { useEffect } from 'react'
import { Alert, AppState } from 'react-native'
import Orientation from 'react-native-orientation-locker'
import DeviceInfo from 'react-native-device-info'
import notifee, { EventType } from '@notifee/react-native'
import {
  cardService,
  cacheService,
  bleCacheService,
  permissionService,
} from '@/services'
import { notifyChangePhoneOnScreen } from '@/utils'
import { useUserContext } from '@/contexts'

export const useAppViewModel = () => {
  const { actions: userContextActions } = useUserContext()

  useEffect(() => {
    ;(async () => {
      await permissionService.setupNotifications()
    })()
    cacheService.ensureInitialized()
    cacheService.ensureTodayDashBoardCache()

    console.log('effect')
    console.log(DeviceInfo.isTablet())

    if (DeviceInfo.isTablet()) {
      Orientation.unlockAllOrientations()
    } else {
      Orientation.lockToPortrait()
    }

    const unsub = notifee.onForegroundEvent(async ({ type, detail }) => {
      if (type !== EventType.ACTION_PRESS && type !== EventType.PRESS) return

      const actionId = detail.pressAction?.id
      const { cardId, newPhone } = detail.notification?.data || {}

      if (actionId !== 'confirm' || !newPhone || !cardId) return

      const res = await cardService.updatePhone(
        String(cardId),
        String(newPhone),
      )
      if (!res.status) {
        return Alert.alert(res.message)
      }
      bleCacheService.markAlertLastDeniedAt()
      bleCacheService.clearAlertPending()
    })

    return () => unsub()
  }, [])

  // 외부에서 포그라운드로 다시 들어가는 경우
  useEffect(() => {
    const sub = AppState.addEventListener('change', async state => {
      if (state !== 'active') return
      cacheService.ensureTodayDashBoardCache()

      const pendingList = bleCacheService.getAlertPendingList()
      pendingList.forEach(pending => {
        if (pending)
          notifyChangePhoneOnScreen(
            pending.cardName,
            pending.cardId,
            pending.phone,
            userContextActions.updateCardPhone,
          )
      })

      bleCacheService.clearAlertPending()
    })

    return () => sub.remove()
  }, [userContextActions])
}
