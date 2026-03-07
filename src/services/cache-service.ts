import { cacheClient } from '@/client'
import { CacheService } from './types'

export const cacheService: CacheService = {
  ensureInitialized: () => {
    const hasInitializedCache = cacheClient.getHasInitializedCache()
    if (hasInitializedCache) return

    cacheClient.setNotice(true)
    cacheClient.setAutoSet(true)
    cacheClient.setActive(true)
    cacheClient.setHasSeenOnBoarding(false)
    cacheClient.setAlertPending([])
    cacheClient.setAlertDeniedAt(0)
    cacheClient.setHasInitializedCache(true)
  },
  setHasSeenOnBoarding: value => {
    cacheClient.setHasSeenOnBoarding(value)
  },
  getHasSeenOnBoarding: () => {
    return cacheClient.getHasSeenOnBoarding()
  },
}
