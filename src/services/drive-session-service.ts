import { Platform } from 'react-native'
import notifee, {
  AndroidForegroundServiceType,
  EventType,
} from '@notifee/react-native'
import {
  DRIVE_END_ACTION,
  DRIVE_NOTIFICATION_CHANNEL_ID,
  DRIVE_NOTIFICATION_ID,
} from '@/constants'
import { DriveSessionService } from './types'

// 포그라운드 서비스를 끝낼 때 호출 (registerForegroundService의 Promise를 끝낸다)
let finishService: (() => void) | null = null
const endListeners = new Set<() => void>()

// 주행 중 백그라운드 기록 유지.
// Android: 위치 타입 포그라운드 서비스 + [주행 종료] 버튼이 있는 상시 알림
// iOS: 위치 백그라운드 모드로 유지되므로 할 일이 없다 (상단에 파란 위치 표시)
export const driveSessionService: DriveSessionService = {
  // index.js에서 앱 시작 시 한 번 등록한다
  registerForegroundService: () => {
    notifee.registerForegroundService(
      () =>
        new Promise<void>(resolve => {
          finishService = resolve
        }),
    )
  },
  start: async cardTitle => {
    if (Platform.OS !== 'android') return
    await notifee.displayNotification({
      id: DRIVE_NOTIFICATION_ID,
      title: '주행 기록 중',
      body: `${cardTitle} · 화면을 꺼도 경로가 기록됩니다`,
      android: {
        channelId: DRIVE_NOTIFICATION_CHANNEL_ID,
        asForegroundService: true,
        foregroundServiceTypes: [
          AndroidForegroundServiceType.FOREGROUND_SERVICE_TYPE_LOCATION,
        ],
        ongoing: true,
        pressAction: { id: 'default', launchActivity: 'default' },
        actions: [
          {
            title: '주행 종료',
            pressAction: { id: DRIVE_END_ACTION, launchActivity: 'default' },
          },
        ],
      },
    })
  },
  stop: async () => {
    if (Platform.OS !== 'android') return
    await notifee.stopForegroundService()
    finishService?.()
    finishService = null
  },
  onEndRequest: listener => {
    endListeners.add(listener)
    return () => {
      endListeners.delete(listener)
    }
  },
  // 알림의 [주행 종료]를 처리했으면 true
  handleNotificationEvent: ({ type, detail }) => {
    if (type !== EventType.ACTION_PRESS) return false
    if (detail.pressAction?.id !== DRIVE_END_ACTION) return false
    endListeners.forEach(listener => listener())
    return true
  },
}
