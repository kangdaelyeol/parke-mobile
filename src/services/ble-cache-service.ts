import { cacheClient } from '@/client'
import { BleCacheService } from './types'

export const bleCacheService: BleCacheService = {
  markDeviceSeenAt: deviceId =>
    cacheClient.setDeviceSeenAt(deviceId, Date.now()),
  getDeviceSeenAt: deviceId => cacheClient.getDeviceSeenAt(deviceId),
  getAlertPendingList: () => cacheClient.getAlertPendingList(),
  hasAlertPending: cardId =>
    cacheClient.getAlertPendingList().some(p => p.cardId === cardId),
  // 카드당 하나만 유지한다 (같은 카드의 이전 요청은 교체)
  pushAlertPending: pending => {
    const pendingList = cacheClient
      .getAlertPendingList()
      .filter(p => p.cardId !== pending.cardId)
    cacheClient.setAlertPending([...pendingList, pending])
  },
  deleteAlertPending: cardId => {
    const pendingList = cacheClient.getAlertPendingList()
    const newPendingList = pendingList.filter(
      pending => pending.cardId !== cardId,
    )
    cacheClient.setAlertPending(newPendingList)
  },
  markAlertLastDeniedAt: () => cacheClient.setAlertDeniedAt(Date.now()),
  getAlertLastDeniedAt: () => cacheClient.getAlertDeniedAt(),
  markBleScan: (deviceName, batteryLevel) => {
    const bleScanCount = cacheClient.getBleScanCount()
    cacheClient.setBleScanCount(bleScanCount + 1)
    cacheClient.setBatteryLevel(batteryLevel)
    cacheClient.setLastScanDeviceName(deviceName)
    cacheClient.markLastScanTime()
  },
  increasePhoneChangeCount: () => {
    const phoneChangeCount = cacheClient.getPhoneChangeCount()
    cacheClient.setPhoneChangeCount(phoneChangeCount + 1)
  },
  getSimultaneousConnectionAlertAt: () =>
    cacheClient.getSimultaneousConnectionAlertAt(),
  markSimultaneousConnectionAlertAt: () =>
    cacheClient.markSimultaneousConnectionAlertAt(),
  getDeviceScan: deviceId => cacheClient.getDeviceScan(deviceId),
  setDeviceScan: (deviceId, scan) => cacheClient.setDeviceScan(deviceId, scan),
}
