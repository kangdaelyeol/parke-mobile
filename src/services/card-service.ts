import { serverTimestamp } from '@react-native-firebase/database'
import {
  cardClient,
  userClient,
  createCardTransaction,
  deleteCardTransaction,
} from '@/client'
import { Card } from '@/domain/card'
import { bleCacheService } from '@/services'
import { CardService, CardState, ServiceSuccess } from '@/services/types'
import { getFirebaseErrorMessage, serviceFail, serviceOk } from '@/utils'

export const cardService: CardService = {
  getCard: async id => {
    const getCardRes = await cardClient.getById(id)
    if (!getCardRes.status)
      return serviceFail(getFirebaseErrorMessage(getCardRes.error))
    if (getCardRes.payload === null) {
      return serviceFail('카드 정보가 존재하지 않습니다.')
    }
    // 구 스키마(custom 없음)로 저장된 카드도 현재 형태로 맞춘다
    const cardDto = Card.fromDto(getCardRes.payload).toDto()
    const scan = bleCacheService.getDeviceScan(cardDto.deviceId)
    return serviceOk({ ...cardDto, scan })
  },
  getList: async idList => {
    const resList = await Promise.allSettled(idList.map(cardService.getCard))

    const cardList = resList
      .filter(
        (r): r is PromiseFulfilledResult<ServiceSuccess<CardState>> =>
          r.status === 'fulfilled' && r.value !== null,
      )
      .map(r => r.value.payload)

    if (resList.length !== cardList.length)
      return serviceFail('카드 정보를 불러오는데 실패했습니다.')

    return serviceOk(cardList)
  },
  getAllow: async serial => {
    const res = await cardClient.getAllowById(serial)
    if (!res.status) {
      return serviceFail(getFirebaseErrorMessage(res.error))
    }
    return serviceOk(res.payload)
  },
  updateCardInfo: async (cardId, { title, phone, theme, custom }) => {
    const res = await cardClient.update({
      id: cardId,
      title,
      phone,
      theme,
      custom,
    })
    if (!res.status) {
      return serviceFail(getFirebaseErrorMessage(res.error))
    }
    return serviceOk(true)
  },
  createCard: async input => {
    const { id, phone, message, title, deviceId, userId, newCardIdList } = input

    const cardRes = await cardClient.getById(id)

    if (!cardRes.status) {
      return serviceFail(getFirebaseErrorMessage(cardRes.error))
    }

    // 이미 등록된 카드(공동 소유)면 기존 테마/스타일은 유지한다
    const existing = cardRes.payload

    const cardDto = Card.create({
      id,
      phone,
      title,
      theme: existing?.theme,
      custom: { ...existing?.custom, message },
      updatedAt: serverTimestamp(),
      deviceId,
      ownerList: existing ? [...existing.ownerList, userId] : [userId],
    }).toDto()

    const res = await createCardTransaction(cardDto, userId, newCardIdList)
    if (!res.status) {
      return serviceFail(getFirebaseErrorMessage(res.error))
    }

    bleCacheService.setDeviceScan(deviceId, true)
    const cardState = { ...cardDto, scan: true }
    return serviceOk(cardState)
  },
  deleteCard: async (cardId, userId) => {
    const userRes = await userClient.getById(userId)
    if (!userRes.status)
      return serviceFail(getFirebaseErrorMessage(userRes.error))
    const cardRes = await cardClient.getById(cardId)
    if (!cardRes.status)
      return serviceFail(getFirebaseErrorMessage(cardRes.error))
    const { payload: user } = userRes
    const { payload: card } = cardRes

    if (user === null || card === null)
      return serviceFail('정보를 찾을 수 없습니다.')

    const newCardIdList = user.cardIdList.filter(id => id !== cardId)

    const newUser = { ...user, cardIdList: newCardIdList }

    const newOwnerList = card.ownerList.filter(id => id !== userId)

    const newCard =
      newOwnerList.length === 0 ? null : { ...card, ownerList: newOwnerList }
    const res = await deleteCardTransaction({
      user: newUser,
      cardId: card.id,
      card: newCard,
    })
    if (!res.status) return serviceFail(getFirebaseErrorMessage(res.error))
    return serviceOk(true)
  },
  updateScan: (deviceId, scan) => bleCacheService.setDeviceScan(deviceId, scan),
  updatePhone: async (id, phone) => {
    const res = await cardClient.update({ id, phone })
    if (!res.status) return serviceFail(getFirebaseErrorMessage(res.error))
    return serviceOk(true)
  },
  updateUpdatedAt: async id => {
    const res = await cardClient.update({ id, updatedAt: serverTimestamp() })
    if (!res.status) return serviceFail(getFirebaseErrorMessage(res.error))
    return serviceOk(true)
  },
}
