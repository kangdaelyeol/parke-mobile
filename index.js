/**
 * @format
 */

import { AppRegistry } from 'react-native'
import notifee, { EventType } from '@notifee/react-native'
import App from './App'
import { name as appName } from './app.json'
import { bleCacheService, cardService } from '@/services'
import { extractNumber } from '@/utils'

notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type !== EventType.ACTION_PRESS && type !== EventType.PRESS) return

  const actionId = detail.pressAction?.id
  const { newPhone, cardId } = detail.notification?.data || {}

  // 알림 본문 탭은 앱을 여는 동작이므로 거절로 보지 않는다.
  // 대기 목록도 남겨 두어, 앱이 열리면 화면 안에서 다시 확인하게 한다.
  if (actionId === 'confirm' && cardId && newPhone) {
    const res = await cardService.updatePhone(cardId, extractNumber(newPhone))
    // 직접 변경한 사용자에게는 한동안 다시 묻지 않는다
    if (res.status) bleCacheService.markAlertLastDeniedAt()
    bleCacheService.deleteAlertPending(cardId)
  } else if (actionId === 'cancel') {
    bleCacheService.markAlertLastDeniedAt()
    bleCacheService.deleteAlertPending(cardId)
  }
})

AppRegistry.registerComponent(appName, () => App)
