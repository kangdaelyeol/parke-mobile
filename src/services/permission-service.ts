import notifee, {
  AndroidImportance,
  AuthorizationStatus,
} from '@notifee/react-native'
import { PermissionsAndroid, Platform } from 'react-native'
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions'
import {
  DRIVE_NOTIFICATION_CHANNEL_ID,
  NOTIFICATION_CHANNEL_ID,
  PHONE_CHANGE_ACTION,
  PHONE_CHANGE_CATEGORY_ID,
} from '@/constants'
import { PermissionService } from './types'

export const permissionService: PermissionService = {
  setupNotifications: async () => {
    await notifee.setNotificationCategories([
      {
        id: PHONE_CHANGE_CATEGORY_ID,
        actions: [
          // iOS에서 백그라운드 처리하려면 foreground: false 권장
          { id: PHONE_CHANGE_ACTION.CONFIRM, title: '변경', foreground: false },
          {
            id: PHONE_CHANGE_ACTION.CANCEL,
            title: '취소',
            destructive: true,
            foreground: false,
          },
        ],
      },
    ])

    // 안드 채널도 여기서 1회
    await notifee.createChannel({
      id: NOTIFICATION_CHANNEL_ID,
      name: 'BLE Device Notifications',
      importance: AndroidImportance.HIGH,
    })
    await notifee.createChannel({
      id: DRIVE_NOTIFICATION_CHANNEL_ID,
      name: '주행 기록',
      importance: AndroidImportance.LOW,
    })
  },
  ensureBluetoothPermission: async () => {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 31) {
        const res = await PermissionsAndroid.requestMultiple([
          'android.permission.BLUETOOTH_SCAN',
          'android.permission.BLUETOOTH_CONNECT',
        ] as any)
        return Object.values(res).every(
          v => v === PermissionsAndroid.RESULTS.GRANTED,
        )
      } else {
        const res = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        )
        return res === PermissionsAndroid.RESULTS.GRANTED
      }
    } else {
      const res = await request(PERMISSIONS.IOS.BLUETOOTH)
      return res === RESULTS.GRANTED
    }
  },
  ensureLocationPermission: async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION

    const res = await request(permission)
    return res === RESULTS.GRANTED || res === RESULTS.LIMITED
  },
  // 권한 팝업을 띄우지 않고 허용 여부만 확인한다
  isBluetoothGranted: async () => {
    if (Platform.OS === 'ios')
      return (await check(PERMISSIONS.IOS.BLUETOOTH)) === RESULTS.GRANTED

    if (Number(Platform.Version) >= 31) {
      const scan = await PermissionsAndroid.check(
        'android.permission.BLUETOOTH_SCAN' as any,
      )
      const connect = await PermissionsAndroid.check(
        'android.permission.BLUETOOTH_CONNECT' as any,
      )
      return scan && connect
    }
    return PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    )
  },
  ensureCameraPermission: async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA

    const res = await request(permission)
    return res === RESULTS.GRANTED
  },
  ensureNotificationPermission: async () => {
    return (
      (await notifee.requestPermission()).authorizationStatus ===
      AuthorizationStatus.AUTHORIZED
    )
  },
}
