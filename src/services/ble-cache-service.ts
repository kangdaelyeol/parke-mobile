import { cacheClient } from '@/client'
import { BleCacheService } from './types'

export const bleCacheService: BleCacheService = {
  markDeviceSeenAt: deviceId =>
    cacheClient.setDeviceSeenAt(deviceId, Date.now()),
  getDeviceSeenAt: deviceId => cacheClient.getDeviceSeenAt(deviceId),
  getAlertPendingList: () => cacheClient.getAlertPendingList(),
  pushAlertPending: ({ phone, cardId, cardName }) => {
    const pendingList = cacheClient.getAlertPendingList()
    pendingList.push({ phone, cardId, cardName })
    cacheClient.setAlertPending(pendingList)
  },
  deleteAlertPending: cardId => {
    const pendingList = cacheClient.getAlertPendingList()
    const newPendingList = pendingList.filter(
      pending => pending?.cardId !== cardId,
    )
    return newPendingList
  },
  clearAlertPending: () => cacheClient.setAlertPending([]),
  markAlertLastDeniedAt: () => cacheClient.setAlertDeniedAt(Date.now()),
  clearAlertLastDeniedAt: () => cacheClient.setAlertDeniedAt(0),
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
