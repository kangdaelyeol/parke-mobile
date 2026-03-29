import { ReactNativeFirebase } from '@react-native-firebase/app'

export const getFirebaseErrorMessage = (
  error: ReactNativeFirebase.NativeFirebaseError,
): string => {
  switch (error.code) {
    case 'database/permission-denied':
      return '접근 권한이 없습니다.'
    case 'database/network-error':
    case 'database/unavailable':
      return '네트워크 연결을 확인해주세요.'
    default:
      return '일시적 오류가 발생했습니다.'
  }
}
