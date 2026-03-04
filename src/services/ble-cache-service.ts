import { AlertPending, cacheClient } from '@/client';

type pushAlertPendingProp = {
  phone: string;
  cardId: string;
  cardName: string;
};

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
  pushAlertPending: ({ phone, cardId, cardName }: pushAlertPendingProp) => {
    const pendingList = cacheClient.getAlertPendingList();
    pendingList.push({ phone, cardId, cardName });
    cacheClient.setAlertPending(pendingList);
  },
  deleteAlertPending: (cardId: string) => {
    const pendingList = cacheClient.getAlertPendingList();
    const newPendingList = pendingList.filter(
      pending => pending?.cardId !== cardId,
    );
    return newPendingList;
  },
  clearAlertPending: () => {
    cacheClient.setAlertPending([]);
  },
  markAlertLastDeniedAt: () => {
    cacheClient.setAlertDeniedAt(Date.now());
  },
  clearAlertLastDeniedAt: () => {
    cacheClient.setAlertDeniedAt(0);
  },
  getAlertLastDeniedAt: (): number => {
    return cacheClient.getAlertDeniedAt();
  },
};
