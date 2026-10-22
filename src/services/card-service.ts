import { serverTimestamp } from '@react-native-firebase/database'
import { cardClient, createCardTransaction } from '@/client'
import { Card } from '@/domain/card'
import { bleCacheService } from '@/services'
import { callFunction } from './functions-client'
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
  // 카드가 없으면 null (getCard는 없는 카드를 실패로 처리한다)
  findCard: async id => {
    const res = await cardClient.getById(id)
    if (!res.status) return serviceFail(getFirebaseErrorMessage(res.error))
    if (res.payload === null) return serviceOk(null)
    return serviceOk(Card.fromDto(res.payload).toDto())
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
  updateCardInfo: async (cardId, { title, phone, theme, layout, custom }) => {
    const res = await cardClient.update({
      id: cardId,
      title,
      phone,
      theme,
      layout,
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
      layout: existing?.layout,
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
  // 카드(기기) 연결 해제. 공동 소유 카드의 번호 정리는 서버가 한다
  leaveCard: async card => {
    const res = await callFunction(
      'leaveCard',
      { cardId: card.id },
      '카드를 삭제하지 못했습니다. 잠시 후 다시 시도해주세요.',
    )
    if (!res.status) return res
    bleCacheService.clearDevice(card.deviceId, card.id)
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
