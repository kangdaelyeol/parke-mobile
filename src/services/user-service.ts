import { userClient } from '@/client'
import { callFunction } from './functions-client'
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
  updateEmail: async (id, email) => {
    const res = await userClient.update({ id, email: email.trim() })
    if (res.status) return serviceOk(true)
    else return serviceFail(getFirebaseErrorMessage(res.error))
  },
  // 회원 탈퇴: 서버가 카드·회원 정보·동의 기록·확인자료·로그인 계정을 모두 정리한다
  deleteAccount: async () => {
    const res = await callFunction(
      'deleteAccount',
      undefined,
      '회원 탈퇴를 처리하지 못했습니다. 잠시 후 다시 시도해주세요.',
    )
    return res.status ? serviceOk(true) : res
  },
}
