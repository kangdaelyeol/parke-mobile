export const GATT_SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab'
export const ADV_SERVICE_UUID = '0000FF00-0000-1000-8000-00805F9B34FB'
export const CHAR_UUID = 'abcd1234-1234-1234-1234-1234567890ab'
export const DEFAULT_DEVICE_ID = 'default'
export const BLE_DEVICE_NAME = 'Parke'
export const SCAN_COOLDOWN_MS = 5 * 1000
// iOS 백그라운드 스캔은 같은 기기를 스캔 세션당 한 번만 알려주므로, 이 간격으로 스캔을 재시작한다
export const BACKGROUND_SCAN_RESTART_MS = 30 * 1000
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
// 카카오맵 JavaScript 키 (카카오 개발자 콘솔 > 앱 키 > JavaScript 키)
// 콘솔 > 플랫폼 키 > JavaScript 키 > JavaScript SDK 도메인에 KAKAO_MAP_BASE_URL을 등록해야 지도가 뜬다
export const KAKAO_MAP_JS_KEY = '63bb3baacd0d6aa1b792cac97459eabf'
// 반드시 https: 카카오 로더가 이 주소의 프로토콜로 지도 엔진을 받는데,
// http면 iOS(ATS)/Android(cleartext 차단)에서 막혀 지도가 뜨지 않는다
export const KAKAO_MAP_BASE_URL = 'https://localhost'
export const PARKE_WEB_URL = 'https://parke-web.netlify.app/parke/'
