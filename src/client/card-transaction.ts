import { db } from '@/firebaseApp'
import { ref, update } from '@react-native-firebase/database'
import { FirebaseResult } from './types'
import { CardDto } from '@/domain/card'
import { clientFail, clientOk } from '@/utils'

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
