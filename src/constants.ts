export const GATT_SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab'
export const ADV_SERVICE_UUID = '0000FF00-0000-1000-8000-00805F9B34FB'
export const CHAR_UUID = 'abcd1234-1234-1234-1234-1234567890ab'
export const DEFAULT_DEVICE_ID = 'default'
export const BLE_DEVICE_NAME = 'Parke'
export const SCAN_COOLDOWN_MS = 5 * 1000
export const RENEW_INTERVAL_MS = 30 * 60 * 1000
export const SIMULTANEOUS_INTERVAL_MS = 60 * 60 * 1000
// 번호 변경을 거절하거나 직접 변경한 뒤, 다시 묻지 않는 시간
export const CONFIRM_COOLDOWN_MS = 60 * 60 * 1000
// 번호 변경 확인 알림 (permission-service에서 등록, 알림 표시/응답 처리에서 사용)
export const NOTIFICATION_CHANNEL_ID = 'ble-device'
export const PHONE_CHANGE_CATEGORY_ID = 'CONFIRM_PHONE'
export const PHONE_CHANGE_ACTION = {
  CONFIRM: 'confirm',
  CANCEL: 'cancel',
} as const
export const GOOGLE_WEB_CLIENT_ID =
  '1092969773825-bke8dokdo3cdfr2ribgavlc7lgkiev54.apps.googleusercontent.com'
export const PARKE_WEB_URL = 'https://parke-web.netlify.app/parke/'
