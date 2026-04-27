import { cardClient, userClient } from '@/client'
import { Card } from '@/domain/card'
import { User } from '@/domain/user'
import { getFirebaseErrorMessage, serviceFail, serviceOk } from '@/utils'
import {
  CardUpdates,
  deleteCardTransaction,
  deleteUserTransaction,
} from '@/helpers'
import { UserService } from './types'

export const userService: UserService = {
  getUser: async id => {
    const res = await userClient.getById(id)
    if (res.status) {
      if (res.payload === null) return serviceFail('유저가 존재하지 않습니다.')
      if (!res.payload.cardIdList) res.payload.cardIdList = []
      return serviceOk(res.payload)
    } else return serviceFail(getFirebaseErrorMessage(res.error))
  },
  createUser: async user => {
    const dto = User.create(user).toDto()
    const res = await userClient.create(dto)
    if (res.status) return serviceOk(dto)
    else return serviceFail(getFirebaseErrorMessage(res.error))
  },
  updateNicknameAndPhone: async (id, nickname, phone) => {
    const res = await userClient.update({ id, nickname, phone })
    if (res.status) return serviceOk(true)
    else return serviceFail(getFirebaseErrorMessage(res.error))
  },
  updateCardIdList: async (id, cardIdList) => {
    const res = await userClient.update({ id, cardIdList })
    if (res.status) return serviceOk(true)
    else return serviceFail(getFirebaseErrorMessage(res.error))
  },
  deleteUser: async (userId, cardList) => {
    const cardUpdates = {} as CardUpdates

    cardList.forEach(card => {
      const cardDto = Card.create({ ...card }).toDto()
      const newOwnerList = cardDto.ownerList.filter(
        ownerId => ownerId !== userId,
      )

      cardDto.ownerList = newOwnerList
      cardUpdates[`card/${cardDto.id}`] =
        newOwnerList.length === 0 ? null : cardDto
    })

    const deleteRes = await deleteUserTransaction({ userId, cardUpdates })
    if (deleteRes.status) return serviceOk(true)
    else return serviceFail(getFirebaseErrorMessage(deleteRes.error))
  },
  deleteCard: async (userId, cardId) => {
    const userRes = await userClient.getById(userId)
    if (!userRes.status)
      return serviceFail(getFirebaseErrorMessage(userRes.error))
    const cardRes = await cardClient.getById(cardId)
    if (!cardRes.status)
      return serviceFail(getFirebaseErrorMessage(cardRes.error))

    const { payload: user } = userRes
    const { payload: card } = cardRes

    if (!user) return serviceFail('유저 정보가 존재하지 않습니다.')
    if (!card) {
      return serviceFail('카드 정보를 불러오는데 실패했습니다.')
    }

    const newCardIdList = user.cardIdList.filter(id => id !== cardId)
    user.cardIdList = newCardIdList

    const newCardOwnerList = card.ownerList.filter(id => id !== userId)
    if (newCardOwnerList.length === 0) {
      const transactionRes = await deleteCardTransaction({
        user,
        cardId: card.id,
        card: null,
      })
      if (transactionRes.status) return serviceOk(true)
      else return serviceFail(getFirebaseErrorMessage(transactionRes.error))
    }

    card.ownerList = newCardOwnerList
    const transactionRes = await deleteCardTransaction({
      user,
      cardId: card.id,
      card,
    })
    if (transactionRes.status) return serviceOk(true)
    else return serviceFail('카드 정보 업데이트에 실패했습니다.')
  },
}
