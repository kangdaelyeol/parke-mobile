import { serverTimestamp } from 'firebase/database'
import { cardClient, userClient } from '@/client'
import { Card } from '@/domain/card'
import { bleCacheService } from '@/services'
import { CardService, CardState } from '@/services/types'

export const cardService: CardService = {
  getCard: async id => {
    const dto = await cardClient.getById(id)
    if (!dto) return null
    const scan = bleCacheService.getDeviceScan(dto.deviceId)
    return { ...dto, scan }
  },
  getList: async idList => {
    const res = await Promise.allSettled(idList.map(cardService.getCard))
    if (!res) return null
    return res
      .filter(
        (r): r is PromiseFulfilledResult<CardState> =>
          r.status === 'fulfilled' && r.value !== null,
      )
      .map(r => r.value)
  },
  getAllow: async serial => {
    const res = await cardClient.getAllowById(serial)
    console.log(res)
    return res
  },
  updateCardInfo: async (cardId, title, phone, message) => {
    try {
      const res = await cardClient.update({ id: cardId, title, phone, message })
      if (res === true) return true
      else return false
    } catch (e) {
      console.log(e)
      return false
    }
  },
  createCard: async input => {
    const { id, phone, message, title, deviceId, userId, userNickname } = input

    const cardEntity = Card.create({
      id,
      phone,
      message,
      title,
      updatedBy: userNickname,
      updatedAt: serverTimestamp(),
      deviceId,
      ownerList: [userId],
    })
    try {
      const dto = await cardClient.create(cardEntity.toDto())
      if (dto !== null) {
        bleCacheService.setDeviceScan(dto.deviceId, true)
        return { ...dto, scan: true }
      } else return null
    } catch (e) {
      console.log(e)
      return null
    }
  },
  deleteCard: async (cardId, userId) => {
    const card = await cardClient.getById(cardId)
    const user = await userClient.getById(userId)
    if (!user || !card) return false
    const newCardIdList = user.cardIdList.filter(id => id !== cardId)

    const res = await userClient.update({
      id: userId,
      cardIdList: newCardIdList,
    })
    if (!res) return false
    const newOwnerList = card.ownerList.filter(id => id !== userId)
    if (newOwnerList.length === 0) return await cardClient.deleteById(cardId)
    return cardClient.update({ ...card, ownerList: newOwnerList })
  },
  updateScan: (deviceId, scan) => bleCacheService.setDeviceScan(deviceId, scan),
  updatePhone: async (id, phone) => {
    return await cardClient.update({ id, phone })
  },
  updateUpdatedAt: async id => {
    return await cardClient.update({ id, updatedAt: serverTimestamp() })
  },
}
