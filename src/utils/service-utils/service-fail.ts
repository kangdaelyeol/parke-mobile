import { ServiceFailure } from '@/services/types'

export const serviceFail = (message: string): ServiceFailure =>
  ({ status: false, message } as const)
