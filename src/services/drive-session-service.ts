import { NativeModules, Platform } from 'react-native'
import notifee, {
  AndroidForegroundServiceType,
  EventType,
} from '@notifee/react-native'
import {
  DRIVE_END_ACTION,
  DRIVE_NOTIFICATION_CHANNEL_ID,
  DRIVE_NOTIFICATION_ID,
} from '@/constants'
import { formatDuration, formatKm } from '@/utils/format'
import { DriveSessionService } from './types'

// iOS Live Activity 네이티브 모듈 (ios/DriveBridge)
interface DriveLiveActivityModule {
  start: (
    cardTitle: string,
    accentHex: string,
    startAt: number,
  ) => Promise<boolean>
  update: (
    distanceMeters: number,
    speedKmh: number,
    averageSpeedKmh: number,
    weakSignal: boolean,
  ) => void
  endActivity: () => void
  consumeEndRequest: () => Promise<boolean>
}
const liveActivity: DriveLiveActivityModule | undefined =
  Platform.OS === 'ios' ? NativeModules.DriveLiveActivity : undefined

// 잠금화면 [주행 종료] 확인 주기 (iOS: 버튼은 앱 프로세스에서 표시만 남긴다)
const END_REQUEST_POLL_MS = 1000

// 포그라운드 서비스를 끝낼 때 호출 (registerForegroundService의 Promise를 끝낸다)
let finishService: (() => void) | null = null
let endPollTimer: ReturnType<typeof setInterval> | null = null
let cardTitle = ''
const endListeners = new Set<() => void>()
const notifyEnd = () => endListeners.forEach(listener => listener())

// Android 상시 알림 (같은 id로 다시 띄우면 내용만 바뀐다)
const showAndroidNotification = (body: string) =>
  notifee.displayNotification({
    id: DRIVE_NOTIFICATION_ID,
    title: `주행 기록 중 · ${cardTitle}`,
    body,
    android: {
      channelId: DRIVE_NOTIFICATION_CHANNEL_ID,
      asForegroundService: true,
      foregroundServiceTypes: [
        AndroidForegroundServiceType.FOREGROUND_SERVICE_TYPE_LOCATION,
      ],
      ongoing: true,
      onlyAlertOnce: true,
      pressAction: { id: 'default', launchActivity: 'default' },
      actions: [
        {
          title: '주행 종료',
          pressAction: { id: DRIVE_END_ACTION, launchActivity: 'default' },
        },
      ],
    },
  })

// 주행 중 잠금화면 표시와 백그라운드 기록 유지.
// iOS: Live Activity (잠금화면 / 다이내믹 아일랜드) + 위치 백그라운드 모드
// Android: 위치 타입 포그라운드 서비스 + [주행 종료] 버튼이 있는 상시 알림
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
  start: async ({ cardTitle: title, accent, startAt }) => {
    cardTitle = title

    if (Platform.OS === 'android') {
      await showAndroidNotification('화면을 꺼도 경로가 기록됩니다')
      return
    }

    try {
      await liveActivity?.start(title, accent, startAt)
    } catch (e) {
      console.log('[DriveSession] live activity start failed', e)
    }
    if (endPollTimer) clearInterval(endPollTimer)
    endPollTimer = setInterval(async () => {
      if (await liveActivity?.consumeEndRequest()) notifyEnd()
    }, END_REQUEST_POLL_MS)
  },
  update: ({ distance, elapsed, speedKmh, averageSpeedKmh, weakSignal }) => {
    if (Platform.OS === 'android') {
      const signal = weakSignal ? ' · GPS 신호 약함' : ''
      showAndroidNotification(
        `${formatKm(distance)} km · ${formatDuration(
          elapsed,
        )} · ${speedKmh} km/h${signal}`,
      )
      return
    }
    liveActivity?.update(distance, speedKmh, averageSpeedKmh, weakSignal)
  },
  stop: async () => {
    if (Platform.OS === 'android') {
      await notifee.stopForegroundService()
      finishService?.()
      finishService = null
      return
    }
    if (endPollTimer) clearInterval(endPollTimer)
    endPollTimer = null
    liveActivity?.endActivity()
  },
  onEndRequest: listener => {
    endListeners.add(listener)
    return () => {
      endListeners.delete(listener)
    }
  },
  // Android 알림의 [주행 종료]를 처리했으면 true
  handleNotificationEvent: ({ type, detail }) => {
    if (type !== EventType.ACTION_PRESS) return false
    if (detail.pressAction?.id !== DRIVE_END_ACTION) return false
    notifyEnd()
    return true
  },
}
