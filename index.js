/**
 * @format
 */

import { AppRegistry } from 'react-native'
import notifee from '@notifee/react-native'
import App from './App'
import { name as appName } from './app.json'
import { bleService, permissionService, phoneChangeService } from '@/services'

// 앱이 백그라운드일 때 알림 응답 (앱이 켜져 있을 때는 use-app-view-model)
notifee.onBackgroundEvent(async event => {
  await phoneChangeService.handleNotificationEvent(event)
})

// iOS가 BLE 이벤트로 앱을 백그라운드에서 다시 띄울 때 상태를 복원하려면
// BleManager가 시작 시점에 있어야 한다. 권한 전에 만들면 권한 팝업이 먼저 뜨므로 허용된 경우에만 만든다.
permissionService.isBluetoothGranted().then(granted => {
  if (granted) bleService.initManager()
})

AppRegistry.registerComponent(appName, () => App)
