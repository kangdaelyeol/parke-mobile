import { BleManager, Device, Subscription } from 'react-native-ble-plx'
import {
  BLE_DEVICE_NAME,
  CHAR_UUID,
  GATT_SERVICE_UUID,
  ADV_SERVICE_UUID,
  BACKGROUND_SCAN_RESTART_MS,
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
import {
  bleCacheService,
  cardService,
  permissionService,
  settingService,
} from '@/services'
import {
  extractNumber,
  showPhoneChangeConfirmNotification,
  showPhoneChangedNotification,
} from '@/utils'
import { BackgroundScanContext, BleService } from './types'

const isCandidate = (dev: Device) =>
  !!dev && (dev.localName ?? '').startsWith(BLE_DEVICE_NAME)

let bleManager: BleManager | null = null

// 백그라운드 스캔 상태
let backgroundContext: BackgroundScanContext | null = null
let backgroundWanted = false // 조건상 스캔이 켜져 있어야 하는가
let isBackgroundScanning = false // 실제로 스캔 중인가
let restartTimer: ReturnType<typeof setInterval> | null = null
let powerSub: Subscription | null = null

let isSearching = false

const listeners = new Set<() => void>()
const notifyListeners = () => listeners.forEach(listener => listener())

const getManager = () => {
  if (!bleManager)
    bleManager = new BleManager({
      restoreStateIdentifier: 'com.app.ble',
      // iOS가 BLE 이벤트로 앱을 백그라운드에서 다시 띄운 경우.
      // 로그인이 복원되면 useBackgroundScan이 스캔을 다시 시작한다.
      restoreStateFunction: () => console.log('BLE state restored'),
    })
  return bleManager
}

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
  }: BackgroundScanContext,
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

const startBackgroundDeviceScan = (manager: BleManager) => {
  manager.startDeviceScan(
    [ADV_SERVICE_UUID],
    { allowDuplicates: true },
    async (err, device) => {
      const context = backgroundContext
      try {
        if (err || !device || !context) return
        await handleBackgroundDevice(device, context)
      } catch (e) {
        context?.onError(e)
      } finally {
        try {
          await device?.cancelConnection()
        } catch {}
      }
    },
  )
}

// 블루투스가 켜지면 스캔을 시작하고, 주기적으로 재시작한다
const runBackgroundScan = () => {
  if (isBackgroundScanning || isSearching) return
  const manager = getManager()

  powerSub?.remove()
  powerSub = manager.onStateChange(state => {
    if (state !== 'PoweredOn') return
    powerSub?.remove()
    powerSub = null
    if (!backgroundWanted || isSearching || isBackgroundScanning) return

    isBackgroundScanning = true
    startBackgroundDeviceScan(manager)
    restartTimer = setInterval(async () => {
      await manager.stopDeviceScan()
      if (isBackgroundScanning) startBackgroundDeviceScan(manager)
    }, BACKGROUND_SCAN_RESTART_MS)
    notifyListeners()
  }, true)
}

const haltBackgroundScan = async () => {
  powerSub?.remove()
  powerSub = null
  if (restartTimer) clearInterval(restartTimer)
  restartTimer = null

  if (!isBackgroundScanning) return
  isBackgroundScanning = false
  await bleManager?.stopDeviceScan()
  notifyListeners()
}

export const bleService: BleService = {
  initManager: () => {
    getManager()
  },
  getManager,
  setBackgroundContext: context => {
    backgroundContext = context
  },
  refreshBackgroundScan: async () => {
    const context = backgroundContext
    backgroundWanted =
      !!context &&
      context.user.phone.trim() !== '' &&
      context.cards.length > 0 &&
      settingService.getSettings().active

    if (!backgroundWanted) return haltBackgroundScan()

    if (!(await permissionService.ensureBluetoothPermission())) {
      backgroundWanted = false
      context?.onPermissionDenied()
      return haltBackgroundScan()
    }

    runBackgroundScan()
  },
  isBackgroundScanning: () => isBackgroundScanning,
  subscribe: listener => {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
  startSearchBle: async ({
    cards,
    onError,
    onDuplicated,
    onDeviceFound,
    onRssiChange,
  }) => {
    if (isSearching) return
    // 기기 등록 검색 중에는 백그라운드 스캔을 잠시 멈춘다
    await haltBackgroundScan()
    isSearching = true

    const manager = getManager()
    await manager.stopDeviceScan()

    manager.startDeviceScan(
      [ADV_SERVICE_UUID],
      { allowDuplicates: true },
      async (error, device) => {
        if (error || !device) return
        console.log(device)

        if (!isCandidate(device)) return

        onRssiChange(String(device.rssi))

        if (!device.rssi || device.rssi < -55) return

        try {
          await manager.stopDeviceScan()

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
  stopSearchBle: async () => {
    if (!isSearching) return
    isSearching = false
    await bleManager?.stopDeviceScan()
    if (backgroundWanted) runBackgroundScan()
  },
}
