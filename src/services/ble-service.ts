import { BleManager, Device } from 'react-native-ble-plx'
import {
  BLE_DEVICE_NAME,
  CHAR_UUID,
  GATT_SERVICE_UUID,
  ADV_SERVICE_UUID,
} from '@/constants'
import {
  generateSerialNumber,
  base64ToUtf,
  getDeviceId,
  getBatteryLevel,
  canNotifySimultaneousConnection,
  isAlertDeniedCooldownActive,
  isScanCooldownActive,
  isOwnCard,
} from '@/helpers'
import { bleCacheService, cardService, settingService } from '@/services'
import {
  extractNumber,
  notifyChangePhoneOnBackground,
  notifyChangePhoneOnScreen,
  nofifyChangePhoneMessage,
} from '@/utils'
import { BleService } from './types'

const g = globalThis as any

let scanSession = 0

let isBackgroundScanning = false
let isSearching = false

const isCandidate = (dev: Device) =>
  !!dev && (dev.name ?? '').startsWith(BLE_DEVICE_NAME)

const isBleManager = (manager: any): manager is BleManager => {
  return manager instanceof BleManager
}

let bleManager: null | BleManager = null

export const bleService: BleService = {
  initManager: () => {
    bleManager = new BleManager({
      restoreStateIdentifier: 'com.app.ble',
      restoreStateFunction: async _restored => {
        try {
          g.__BLE_SHOULD_START_SCAN__ = true
        } catch (err) {
          console.warn('Restore callback before JS ready:', err)
        }
      },
    })
  },
  getManager: () => {
    if (!bleManager) bleService.initManager()
    return bleManager
  },
  getSession: () => scanSession,
  updateSession: () => scanSession++,
  stopScan: async (capturedSession: number) => {
    if (bleService.getSession() !== capturedSession) return
    console.log('stopScanning')
    if (!bleManager) bleService.initManager()
    if (!isBleManager(bleManager)) return
    await bleManager.stopDeviceScan()
    isSearching = false
    isBackgroundScanning = false
  },
  startBackgroundScan: async ({
    cards,
    user,
    refreshStateSession,
    onDBError,
    onError,
    onCardPhoneChange,
  }) => {
    if (!bleManager) bleService.initManager()
    if (!isBleManager(bleManager)) return
    console.log('try background scan')
    if (isBackgroundScanning) return
    isBackgroundScanning = true
    console.log('startBackground')

    await bleManager.stopDeviceScan()

    bleManager.startDeviceScan(
      [ADV_SERVICE_UUID],
      { allowDuplicates: true },
      async (err, device) => {
        try {
          if (err || !device) return
          if (!isCandidate(device)) return

          const deviceId = getDeviceId(device.manufacturerData as string)

          if (isScanCooldownActive(deviceId)) return

          bleCacheService.markDeviceSeenAt(deviceId)

          console.log('deviceId:', deviceId)

          const cardState = cards.find(c => c.deviceId === deviceId)
          if (!cardState || !cardState.scan) return

          const card = await cardService.getCard(cardState.id)
          if (!card) return

          console.log('find:', card)
          const batteryLevel = getBatteryLevel(
            device.manufacturerData as string,
          )

          bleCacheService.markBleScan(card.title, batteryLevel)
          refreshStateSession()

          if (isOwnCard(user.phone, card.phone)) {
            await cardService.updateUpdatedAt(card.id)
            bleCacheService.markSimultaneousConnectionAlertAt()
            return
          }

          const settings = settingService.getSettings()

          if (canNotifySimultaneousConnection(card)) {
            notifyChangePhoneOnBackground(card.phone, user.phone, card.deviceId)
            bleCacheService.markSimultaneousConnectionAlertAt()
          }

          if (!settings.autoSet) {
            if (isAlertDeniedCooldownActive()) return

            // 백그라운드로부터 포그라운드 알림 저장(pending...)
            bleCacheService.pushAlertPending({
              cardId: card.id,
              phone: user.phone,
              cardName: card.title,
            })

            if (settings.notice)
              notifyChangePhoneOnBackground(
                card.phone,
                user.phone,
                card.deviceId,
              )

            // 앱이 실행중이면 앱 스크린에서 알림
            notifyChangePhoneOnScreen(
              card.title,
              card.id,
              user.phone,
              onCardPhoneChange,
            )
            refreshStateSession()
          } else {
            // 자동변경 설정이면 알림 확인 없이 바로 자동 변경
            const res = await cardService.updatePhone(
              card.id,
              extractNumber(user.phone),
            )
            if (!res) {
              onDBError()
              return
            }

            bleCacheService.increasePhoneChangeCount()

            onCardPhoneChange(card.id, user.phone)

            // 알림 설정이 On이면 백그라운드로부터 변경 알림 해주기
            if (settings.notice) nofifyChangePhoneMessage(user.phone)

            refreshStateSession()
          }
        } catch (e) {
          onError(e)
        } finally {
          try {
            await device?.cancelConnection()
          } catch {}
        }
      },
    )
  },
  startSearchBle: async ({
    cards,
    onError,
    onDuplicated,
    onDeviceFound,
    onRssiChange,
  }) => {
    if (!bleManager) bleService.initManager()
    if (!isBleManager(bleManager)) return
    console.log('try search ble')
    if (isSearching) return
    isSearching = true
    console.log('startSearchBle')

    await bleManager.stopDeviceScan()

    bleManager.startDeviceScan(
      [ADV_SERVICE_UUID],
      { allowDuplicates: true },
      async (error, device) => {
        if (error || !device) return
        if (!isCandidate(device)) return
        if (!isBleManager(bleManager)) return

        onRssiChange(String(device.rssi))

        if (!device.rssi || device.rssi < -55) return

        try {
          await bleManager.stopDeviceScan()

          const deviceId = getDeviceId(device.manufacturerData as string)

          if (deviceId.slice(0, 5) !== 'UNSET') {
            console.log(device)
            if (cards.find(c => c.deviceId === deviceId)) {
              onDuplicated()
              return
            }
            onDeviceFound(deviceId)
          } else {
            const base64Id = generateSerialNumber()
            console.log(base64Id)
            const d = await device.connect()
            await d.discoverAllServicesAndCharacteristics()
            await d.writeCharacteristicWithResponseForService(
              GATT_SERVICE_UUID,
              CHAR_UUID,
              base64Id,
            )
            await device.cancelConnection()
            onDeviceFound(base64ToUtf(base64Id))
          }
        } catch (e) {
          console.log(e)
          await device.cancelConnection()
          onError(e)
          return
        }
      },
    )
  },
  getState: () => {
    if (!bleManager) bleService.initManager()
    return { isBackgroundScanning, isSearching }
  },
}
