import { db } from '@/firebaseApp'
import { ReactNativeFirebase } from '@react-native-firebase/app'
import { ref, update } from '@react-native-firebase/database'
import { FirebaseResult } from '@/client'
import { CardDto } from '@/domain/card'

interface DeleteUserTransactionProps {
  userId: string
  cardUpdates: Record<string, CardDto | null>
}

export const deleteUserTransaction = async ({
  userId,
  cardUpdates,
}: DeleteUserTransactionProps): Promise<FirebaseResult<boolean>> => {
  try {
    await update(ref(db), { ...cardUpdates, [`user/${userId}`]: null })
    return {
      status: true,
      payload: true,
    }
  } catch (e) {
    return {
      status: false,
      error: e as ReactNativeFirebase.NativeFirebaseError,
    }
  }
}
