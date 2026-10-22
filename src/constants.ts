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
// 주행 기록 중 상시 알림 (Android 포그라운드 서비스). 소리 없이 조용히 표시한다
export const DRIVE_NOTIFICATION_CHANNEL_ID = 'drive-session'
export const DRIVE_NOTIFICATION_ID = 'drive-session'
export const DRIVE_END_ACTION = 'drive-end'
export const PHONE_CHANGE_CATEGORY_ID = 'CONFIRM_PHONE'
export const PHONE_CHANGE_ACTION = {
  CONFIRM: 'confirm',
  CANCEL: 'cancel',
} as const
// [임시] 등록된 기기 없이 주행모드를 테스트하는 홈 헤더 버튼. 개발 빌드에서만 보인다.
// TestFlight 등 릴리스 빌드에서도 필요하면 true로 바꾸고, 출시 전에 버튼과 함께 제거할 것
export const SHOW_DRIVE_TEST_BUTTON = true
export const GOOGLE_WEB_CLIENT_ID =
  '1092969773825-bke8dokdo3cdfr2ribgavlc7lgkiev54.apps.googleusercontent.com'
// 카카오맵 JavaScript 키 (카카오 개발자 콘솔 > 앱 키 > JavaScript 키)
// 콘솔 > 플랫폼 키 > JavaScript 키 > JavaScript SDK 도메인에 KAKAO_MAP_BASE_URL을 등록해야 지도가 뜬다
export const KAKAO_MAP_JS_KEY = '63bb3baacd0d6aa1b792cac97459eabf'
// 반드시 https: 카카오 로더가 이 주소의 프로토콜로 지도 엔진을 받는데,
// http면 iOS(ATS)/Android(cleartext 차단)에서 막혀 지도가 뜨지 않는다
export const KAKAO_MAP_BASE_URL = 'https://localhost'
// Firebase Functions 지역 (backend/functions와 같아야 한다)
export const FUNCTIONS_REGION = 'asia-northeast3'
// 이메일 입력 자동완성 도메인 (자주 쓰는 순)
export const EMAIL_DOMAINS = [
  'gmail.com',
  'naver.com',
  'daum.net',
  'hanmail.net',
  'kakao.com',
  'nate.com',
  'icloud.com',
  'outlook.com',
  'hotmail.com',
]
// 법률 문서 (웹이 유일한 원본, 앱은 LegalDocScreen에서 WebView로 띄운다)
export const LEGAL_DOC_BASE_URL = 'https://originalshq.com'
export const LEGAL_DOC_PATH_PREFIX = '/privacy/parke/'
export const LEGAL_DOCS = {
  privacy: { path: 'privacy', title: '개인정보 처리방침' },
  terms: { path: 'terms', title: '서비스 이용약관' },
  location: { path: 'location', title: '위치기반서비스 이용약관' },
  consent: { path: 'consent', title: '개인정보 수집·이용 동의서' },
  'location-consent': {
    path: 'location-consent',
    title: '개인위치정보 수집·이용 동의서',
  },
  'consent-third': {
    path: 'consent-third',
    title: '개인정보 제3자 제공 동의서',
  },
} as const
// 현재 문서 시행일. 문서 화면을 열지 않고 동의한 경우 이 값으로 기록한다
export const LEGAL_EFFECTIVE_DATE = '2026-10-22'
// 회원가입 필수 동의 / 주행 모드(운행일지) 선택 동의
export const REQUIRED_CONSENT_DOCS = [
  'terms',
  'consent',
  'consent-third',
] as const
export const LOCATION_CONSENT_DOCS = ['location', 'location-consent'] as const
export const PARKE_WEB_URL = 'https://parke-web.netlify.app/parke/'
