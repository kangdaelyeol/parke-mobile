import { cacheClient } from '@/client';

export const cacheService = {
  ensureInitialized: () => {
    const hasInitializedCache = cacheClient.getHasInitializedCache();
    if (hasInitializedCache) return;

    cacheClient.setNotice(true);
    cacheClient.setAutoSet(true);
    cacheClient.setActive(true);
    cacheClient.setHasSeenOnBoarding(false);
    cacheClient.setAlertPending([]);
    cacheClient.setAlertDeniedAt(0);
    cacheClient.setHasInitializedCache(true);
  },
  setHasSeenOnBoarding: (value: boolean) => {
    cacheClient.setHasSeenOnBoarding(value);
  },
  getHasSeenOnBoarding: (): boolean => {
    return cacheClient.getHasSeenOnBoarding();
  },
};
