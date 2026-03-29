import { ServiceSuccess } from '@/services/types'

export const serviceOk = <T>(payload: T): ServiceSuccess<T> => {
  return { status: true, payload }
}
