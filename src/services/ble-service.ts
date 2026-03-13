import { Alert } from 'react-native'
import { BleManager, Device } from 'react-native-ble-plx'
import {
  BLE_DEVICE_NAME,
  CHAR_UUID,
  NOTIFY_COOLDOWN_MS,
  RENEW_INTERVAL_MS,
  SCAN_COOLDOWN_MS,
  GATT_SERVICE_UUID,
  ADV_SERVICE_UUID,
} from '@/constants'
import {
  generateSerialNumber,
  nofifyMessage,
  notifyPhoneChange,
  base64ToUtf,
  getDeviceId,
  getBatteryLevel,
} from '@/helpers'
import { bleCacheService, cardService, settingService } from '@/services'
import { extractNumber, notifyChangePhoneOnScreen } from '@/utils'
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
    setCards,
    refreshStateSession,
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

          // 기본 스캔 쿨다운
          if (
            Date.now() - bleCacheService.getDeviceSeenAt(deviceId) <
            SCAN_COOLDOWN_MS
          )
            return

          bleCacheService.markDeviceSeenAt(deviceId)

          console.log('deviceId:', deviceId)

          const cardState = cards.find(c => c.deviceId === deviceId)
          if (!cardState || !cardState.scan) return

          const card = await cardService.get(cardState.id)
          if (!card) return

          console.log('find:', card)
          const batteryLevel = getBatteryLevel(
            device.manufacturerData as string,
          )

          bleCacheService.markBleScan(card.title, batteryLevel)
          refreshStateSession()

          // 카드의 번호와 자신의 번호와 일치하면 현재 시점을 마킹하고 종료.
          if (String(user.phone) === String(card.phone)) {
            await cardService.updateUpdatedAt(card.id)
            return
          }

          // 업데이트 이후 일정 시간동안 db갱신이 안되어 있으면 운전중이 아니므로 다른 번호로 업데이트 진행.
          // 그렇지 않으면 운전중이기 때문에 updatedAt값 갱신을 함. 따라서 다른 번호로 업데이트를 진행하지 않음.
          if (Date.now() < Number(card.updatedAt) + RENEW_INTERVAL_MS) return

          const settings = settingService.getSettings()

          // 자동변경 설정이 아닐시 알림
          if (!settings.autoSet) {
            // 이전에 변경 거부가 있었는지 확인
            if (
              Date.now() <
              bleCacheService.getAlertLastDeniedAt() + NOTIFY_COOLDOWN_MS
            )
              return

            // 백그라운드로부터 포그라운드 알림 저장(pending...)
            bleCacheService.pushAlertPending({
              cardId: card.id,
              phone: user.phone,
              cardName: card.title,
            })

            if (settings.notice)
              // 알림 설정이 되어 있어야 백그라운드에서 알림
              notifyPhoneChange(card.phone, user.phone, card.deviceId)

            // 앱이 실행중이면 앱 스크린에서 알림
            notifyChangePhoneOnScreen(card.title, card.id, user.phone, setCards)
            refreshStateSession()
          } else {
            // 자동변경 설정이면 알림 확인 없이 바로 자동 변경
            const res = await cardService.updatePhone(
              card.id,
              extractNumber(user.phone),
            )
            if (!res) {
              Alert.alert('정보 업데이트 중 네트워크에 문제가 발생했습니다.')
              return
            }

            bleCacheService.increasePhoneChangeCount()

            setCards(prev => {
              const newCards = [...prev]
              const index = newCards.findIndex(c => c.id === card.id)
              if (index === -1) return prev
              newCards[index].phone = user.phone
              return newCards
            })

            // 알림 설정이 On이면 백그라운드로부터 변경 알림 해주기
            if (settings.notice) nofifyMessage(user.phone)

            refreshStateSession()
          }
        } catch (e) {
          Alert.alert(`[BLE] scan handler error: ${e}`)
        } finally {
          try {
            await device?.cancelConnection()
          } catch {}
        }
      },
    )
  },
  startSearchBle: async ({ navigation, setRssi, cards }) => {
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

        setRssi(String(device.rssi))

        if (!device.rssi || device.rssi < -55) return

        try {
          await bleManager.stopDeviceScan()

          const deviceId = getDeviceId(device.manufacturerData as string)

          if (deviceId.slice(0, 5) !== 'UNSET') {
            console.log(device)
            if (cards.find(c => c.deviceId === deviceId)) {
              Alert.alert('이미 등록된 장치입니다.')
              return navigation.goBack()
            }
            navigation.replace('ScanComplete', {
              value: deviceId,
            })
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
            navigation.replace('ScanComplete', {
              value: base64ToUtf(base64Id),
            })
          }
        } catch (e) {
          console.log(e)
          await device.cancelConnection()
          Alert.alert('통신 중 오류가 발생했습니다. 다시 시도해주세요.')
          return navigation.goBack()
        }
      },
    )
  },
  getState: () => {
    if (!bleManager) bleService.initManager()
    return { isBackgroundScanning, isSearching }
  },
}
