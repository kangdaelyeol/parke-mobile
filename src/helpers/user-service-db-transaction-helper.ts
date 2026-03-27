import { FirebaseResult } from '@/client'
import { CardDto } from '@/domain/card'
import { UserDto } from '@/domain/user'
import { db } from '@/firebaseApp'
import { ReactNativeFirebase } from '@react-native-firebase/app'
import { ref, update } from '@react-native-firebase/database'

interface DeleteCardTransactionProps {
  user: UserDto
  userId: string
  card: CardDto | null
  cardId: string
}

interface DeleteUserTransactionProps {
  userId: string
  cardUpdates: Record<string, CardDto | null>
}
export const deleteCardTransaction = async ({
  userId,
  cardId,
  user,
  card,
}: DeleteCardTransactionProps): Promise<FirebaseResult<boolean>> => {
  try {
    await update(ref(db), {
      [`user/${userId}`]: user,
      [`card/${cardId}`]: card,
    })
    return { status: true, payload: true }
  } catch (e) {
    return {
      status: false,
      error: e as ReactNativeFirebase.NativeFirebaseError,
    }
  }
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
