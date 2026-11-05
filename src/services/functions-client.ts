import { getApp } from '@react-native-firebase/app'
import { getFunctions, httpsCallable } from '@react-native-firebase/functions'
import { FUNCTIONS_REGION } from '@/constants'
import { logger, serviceFail, serviceOk } from '@/utils'
import { ServiceResponse } from './types'

// backend/functions의 Callable 함수 호출.
// 실패하면 서버가 보낸 안내 문구(HttpsError message)를 그대로 돌려준다
export const callFunction = async <T = unknown>(
  name: string,
  data?: unknown,
  fallbackMessage = '요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요.',
): Promise<ServiceResponse<T>> => {
  try {
    const res = await httpsCallable(
      getFunctions(getApp(), FUNCTIONS_REGION),
      name,
    )(data)
    return serviceOk(res.data as T)
  } catch (e) {
    logger.error(`[functions] ${name} failed`, e)
    const message =
      e instanceof Error && e.message
        ? e.message.replace(/^\[[^\]]+\]\s*/, '')
        : ''
    return serviceFail(message || fallbackMessage)
  }
}
