import { db } from '@/firebaseApp'
import { ref, update } from '@react-native-firebase/database'
import { FirebaseResult } from '@/client'
import { CardDto } from '@/domain/card'
import { UserDto } from '@/domain/user'
import { clientFail, clientOk } from '@/utils'

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
      [`user/${userId}/cardIdList`]: newCardList,
    })
    return clientOk(true)
  } catch (e) {
    return clientFail(e)
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
    return clientOk(true)
  } catch (e) {
    return clientFail(e)
  }
}
