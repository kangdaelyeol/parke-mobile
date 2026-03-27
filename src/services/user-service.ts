import { cardClient, userClient } from '@/client'
import { CardDto } from '@/domain/card'
import { User } from '@/domain/user'
import { UserService } from './types'
import { getFirebaseErrorMessage } from '@/utils'

const isCardDto = (obj: any): obj is CardDto => {
  return (
    obj.id ||
    obj.title ||
    obj.phone ||
    obj.message ||
    obj.scan ||
    obj.updatedAt ||
    obj.updatedBy ||
    obj.deviceId ||
    obj.ownerList
  )
}

export const userService: UserService = {
  getUser: async id => {
    const res = await userClient.getById(id)
    if (res.status) {
      if (res.payload === null)
        return { status: false, message: '유저가 존재하지 않습니다.' }
      return { status: true, payload: res.payload }
    } else return { status: false, message: getFirebaseErrorMessage(res.error) }
  },
  createUser: async user => {
    const dto = User.create(user).toDto()
    const res = await userClient.create(dto)
    if (res.status) return { status: true, payload: dto }
    else return { status: false, message: getFirebaseErrorMessage(res.error) }
  },
  updateNicknameAndPhone: async (id, nickname, phone) => {
    const res = await userClient.update({ id, nickname, phone })
    if (res.status) return { status: true, payload: true }
    else return { status: false, message: getFirebaseErrorMessage(res.error) }
  },
  updateCardIdList: async (id, cardList) => {
    const res = await userClient.update({ id, cardIdList: cardList })
    if (res.status) return { status: true, payload: true }
    else return { status: false, message: getFirebaseErrorMessage(res.error) }
  },
  deleteUser: async id => {
    const userRes = await userClient.getById(id)
    if (!userRes.status)
      return { status: false, message: getFirebaseErrorMessage(userRes.error) }

    if (userRes.payload === null)
      return { status: false, message: '유저 정보가 존재하지 않습니다.' }

    const { payload: user } = userRes

    user.cardIdList.forEach(async cardId => {
      const card = await cardClient.getById(cardId)
      if (!isCardDto(card)) return

      card.ownerList = card.ownerList.filter(userId => userId !== id)
      if (card.ownerList.length === 0) await cardClient.deleteById(cardId)
      else await cardClient.update(card)
    })

    const deleteRes = await userClient.deleteById(id)
    if (deleteRes.status) return { status: true, payload: true }
    else
      return {
        status: false,
        message: getFirebaseErrorMessage(deleteRes.error),
      }
  },
  deleteCard: async (userId, cardId) => {
    const userRes = await userClient.getById(userId)
    if (!userRes.status)
      return { status: false, message: getFirebaseErrorMessage(userRes.error) }
    const card = await cardClient.getById(cardId)
    if (!card)
      return { status: false, message: '카드 정보를 불러오는데 실패했습니다.' }

    const { payload: user } = userRes

    if (!user)
      return { status: false, message: '유저 정보가 존재하지 않습니다.' }

    const newCardIdList = user.cardIdList.filter(id => id !== cardId)
    user.cardIdList = newCardIdList
    await userClient.update(user)

    const newCardOwnerList = card.ownerList.filter(id => id !== userId)
    if (newCardOwnerList.length === 0) {
      const cardDeleteRes = await cardClient.deleteById(cardId)
      if (cardDeleteRes) return { status: true, payload: true }
      else return { status: false, message: '카드 삭제에 실패했습니다. ' }
    }

    card.ownerList = newCardOwnerList
    const cardUpdateRes = await cardClient.update(card)
    if (cardUpdateRes) return { status: true, payload: true }
    else
      return { status: false, message: '카드 정보 업데이트에 실패했습니다. ' }
  },
}
