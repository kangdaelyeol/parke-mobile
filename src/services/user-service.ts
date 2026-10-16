import { CardUpdates, deleteUserTransaction, userClient } from '@/client'
import { Card } from '@/domain/card'
import { User } from '@/domain/user'
import { getFirebaseErrorMessage, serviceFail, serviceOk } from '@/utils'
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
  agreeLocation: async id => {
    const res = await userClient.agreeLocation(id)
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
}
