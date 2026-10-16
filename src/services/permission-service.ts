import notifee, {
  AndroidImportance,
  AuthorizationStatus,
} from '@notifee/react-native'
import { PermissionsAndroid, Platform } from 'react-native'
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions'
import {
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
