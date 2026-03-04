import { AlertPending, cacheClient } from '@/client';

export const bleCacheService = {
  markDeviceSeenAt: (deviceId: string) => {
    cacheClient.setDeviceSeenAt(deviceId, Date.now());
  },
  getDeviceSeenAt: (deviceId: string): number => {
    return cacheClient.getDeviceSeenAt(deviceId);
  },
  getAlertPendingList: (): AlertPending[] => {
    return cacheClient.getAlertPendingList();
  },
  pushAlertPending: (phone: string, cardId: string) => {
    const pendingList = cacheClient.getAlertPendingList();
    pendingList.push({ phone, cardId });
    cacheClient.setAlertPending(pendingList);
  },
  clearAlertPending: () => {
    cacheClient.setAlertPending([]);
  },
};
