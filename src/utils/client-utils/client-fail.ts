import { ReactNativeFirebase } from '@react-native-firebase/app'
import { ClientFailure } from '@/client'

export const clientFail = (
  error: unknown,
): ClientFailure<ReactNativeFirebase.NativeFirebaseError> => {
  return {
    status: false,
    error: error as ReactNativeFirebase.NativeFirebaseError,
  }
}
