import { db } from '@/firebaseApp'
import { ReactNativeFirebase } from '@react-native-firebase/app'
import { ref, update } from '@react-native-firebase/database'
import { FirebaseResult } from '@/client'
import { CardDto } from '@/domain/card'
import { UserDto } from '@/domain/user'

interface DeleteCardTransactionProps {
  user: UserDto
  card: CardDto | null
  cardId: string
}

export const createCardTransaction = async (
  card: CardDto,
  userId: string,
  newCardList: string[],
): Promise<FirebaseResult<boolean>> => {
  try {
    await update(ref(db), {
      [`card/${card.id}`]: card,
      [`user/${userId}/ownerList`]: newCardList,
    })
    return { status: true, payload: true }
  } catch (e) {
    return {
      status: false,
      error: e as ReactNativeFirebase.NativeFirebaseError,
    }
  }
}

export const deleteCardTransaction = async ({
  user,
  cardId,
  card,
}: DeleteCardTransactionProps): Promise<FirebaseResult<boolean>> => {
  try {
    await update(ref(db), {
      [`user/${user.id}`]: user,
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
