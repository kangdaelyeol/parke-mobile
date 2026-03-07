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

  if (actionId === 'confirm' && cardId && newPhone) {
    await cardService.updatePhone(cardId, extractNumber(newPhone))
  } else {
    bleCacheService.markAlertLastDeniedAt()
  }
  bleCacheService.deleteAlertPending(cardId)
})

AppRegistry.registerComponent(appName, () => App)
