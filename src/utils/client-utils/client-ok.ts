import { ClientSuccess } from '@/client'

export const clientOk = <T>(payload: T): ClientSuccess<T> => {
  return { status: true, payload }
}
