import { db } from '@/firebaseApp'
import { ref, update } from '@react-native-firebase/database'
import { FirebaseResult } from '@/client'
import { CardDto } from '@/domain/card'
import { clientFail, clientOk } from '@/utils'

export type CardUpdates = Record<string, CardDto | null>

interface DeleteUserTransactionProps {
  userId: string
  cardUpdates: CardUpdates
}

export const deleteUserTransaction = async ({
  userId,
  cardUpdates,
}: DeleteUserTransactionProps): Promise<FirebaseResult<boolean>> => {
  try {
    await update(ref(db), { ...cardUpdates, [`user/${userId}`]: null })
    return clientOk(true)
  } catch (e) {
    return clientFail(e)
  }
}
