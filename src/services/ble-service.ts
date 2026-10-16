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
  isConfirmCooldownActive,
  isScanCooldownActive,
  isOwnCard,
  canRenewPhoneNumber,
} from '@/helpers'
import { bleCacheService, cardService, settingService } from '@/services'
import {
  extractNumber,
  showPhoneChangeConfirmNotification,
  showPhoneChangedNotification,
} from '@/utils'
import { BleService, StartBackgroundScanProps } from './types'

const g = globalThis as any

let scanSession = 0

let isBackgroundScanning = false
let isSearching = false

const isCandidate = (dev: Device) =>
  !!dev && (dev.localName ?? '').startsWith(BLE_DEVICE_NAME)

const isBleManager = (manager: any): manager is BleManager => {
  return manager instanceof BleManager
}

let bleManager: null | BleManager = null

// 백그라운드 스캔 중 Parke 장치가 감지됐을 때의 처리
const handleBackgroundDevice = async (
  device: Device,
  {
    cards,
    user,
    refreshStateSession,
    onDBError,
    onCardPhoneChange,
    onPhoneChangeRequest,
  }: Omit<StartBackgroundScanProps, 'onError'>,
) => {
  if (!isCandidate(device)) return

  const deviceId = getDeviceId(device.manufacturerData as string)

  if (isScanCooldownActive(bleCacheService.getDeviceSeenAt(deviceId))) return

  bleCacheService.markDeviceSeenAt(deviceId)

  console.log('deviceId:', deviceId)

  const cardState = cards.find(c => c.deviceId === deviceId)
  if (!cardState || !cardState.scan) return

  const cardRes = await cardService.getCard(cardState.id)
  if (!cardRes.status) return

  const card = cardRes.payload

  console.log('find:', card)
  const batteryLevel = getBatteryLevel(device.manufacturerData as string)
  console.log('battery:', batteryLevel)

  bleCacheService.markBleScan(card.title, batteryLevel)
  refreshStateSession()

  if (isOwnCard(user.phone, card.phone)) {
    await cardService.updateUpdatedAt(card.id)
    bleCacheService.markSimultaneousConnectionAlertAt()
    return
  }

  const settings = settingService.getSettings()

  if (
    canNotifySimultaneousConnection(
      card,
      settings.notice,
      bleCacheService.getSimultaneousConnectionAlertAt(),
    )
  ) {
    showPhoneChangeConfirmNotification(card.phone, user.phone, card.id)
    bleCacheService.markSimultaneousConnectionAlertAt()
    return
  }

  if (!canRenewPhoneNumber(card)) return

  if (!settings.autoSet) {
    if (isConfirmCooldownActive(bleCacheService.getAlertLastDeniedAt())) return

    // 이미 응답을 기다리는 요청이 있으면 다시 묻지 않는다
    if (bleCacheService.hasAlertPending(card.id)) return

    // 응답할 때까지 대기 목록에 남겨, 앱이 다시 열릴 때도 묻는다
    const pending = { cardId: card.id, cardName: card.title, phone: user.phone }
    bleCacheService.pushAlertPending(pending)

    if (settings.notice)
      showPhoneChangeConfirmNotification(card.phone, user.phone, card.id)

    // 앱이 실행 중이면 앱 화면에서도 묻는다
    onPhoneChangeRequest(pending)
    refreshStateSession()
  } else {
    // 자동변경 설정이면 알림 확인 없이 바로 자동 변경
    const res = await cardService.updatePhone(
      card.id,
      extractNumber(user.phone),
    )
    if (!res.status) {
      onDBError(res.message)
      return
    }

    bleCacheService.increasePhoneChangeCount()

    onCardPhoneChange(card.id, user.phone)

    // 알림 설정이 On이면 백그라운드로부터 변경 알림 해주기
    if (settings.notice) showPhoneChangedNotification(card.title, user.phone)

    refreshStateSession()
  }
}

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
  startBackgroundScan: async ({ onError, ...scanProps }) => {
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
          await handleBackgroundDevice(device, scanProps)
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
        console.log(device)

        if (!isCandidate(device)) return
        if (!isBleManager(bleManager)) return

        onRssiChange(String(device.rssi))

        if (!device.rssi || device.rssi < -55) return

        try {
          await bleManager.stopDeviceScan()

          const deviceId = getDeviceId(device.manufacturerData as string)

          if (deviceId.slice(0, 5) !== 'UNSET') {
            if (cards.find(c => c.deviceId === deviceId)) {
              onDuplicated()
              return
            }
            onDeviceFound(deviceId)
            return
          }

          const base64Id = generateSerialNumber()
          const d = await device.connect()
          await d.discoverAllServicesAndCharacteristics()
          await d.writeCharacteristicWithResponseForService(
            GATT_SERVICE_UUID,
            CHAR_UUID,
            base64Id,
          )
          console.log('on disconnecting...')
          await device.cancelConnection()
          console.log('disconnecting succeed!')
          onDeviceFound(base64ToUtf(base64Id))
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
