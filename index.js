/**
 * @format
 */

import { AppRegistry } from 'react-native'
import notifee from '@notifee/react-native'
import App from './App'
import { name as appName } from './app.json'
import { phoneChangeService } from '@/services'

// 앱이 백그라운드일 때 알림 응답 (앱이 켜져 있을 때는 use-app-view-model)
notifee.onBackgroundEvent(async event => {
  await phoneChangeService.handleNotificationEvent(event)
})

AppRegistry.registerComponent(appName, () => App)
