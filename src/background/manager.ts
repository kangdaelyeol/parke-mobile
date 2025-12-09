// manager.ts
import { BleManager, Device, State } from 'react-native-ble-plx';
import { SCAN_COOLDOWN_MS, SERVICE_UUID } from '../constants';
import { cache } from '../storage';
import { notifyPhoneChange } from '../helpers/notify-phone-change';
import { Alert } from 'react-native';
import { deviceService } from '../services';
import { notifyOnScreenToChangePhone } from '../utils/notify-on-screen-to-change-phone';
import { nofifyMessage } from '../helpers/notify-message';
import { settingService } from '../services/settingService';

const { getDeviceBySerial } = deviceService;

// ===== 싱글톤 보장 =====
const g = globalThis as any;

export const manager = new BleManager({
  restoreStateIdentifier: 'com.app.ble',
  restoreStateFunction: async _restored => {
    try {
      g.__BLE_SHOULD_START_SCAN__ = true;
    } catch (err) {
      console.warn('Restore callback before JS ready:', err);
    }
  },
});

// ===== 중복 스캔 방지 =====
let isScanning = false;

// Bluetooth PoweredOn/권한 대기
async function ensureReady(): Promise<boolean> {
  // (안드로이드 12+ 권한 체크/요청은 여기에—생략)
  if (!manager) return false;

  let state = await manager.state();
  if (state !== State.PoweredOn) {
    await new Promise<void>(resolve => {
      const sub = manager.onStateChange(s => {
        if (s === State.PoweredOn) {
          sub.remove();
          resolve();
        }
      }, true);
    });
    state = await manager.state();
  }
  return state === State.PoweredOn;
}

export async function safeStartScan() {
  if (isScanning) return;
  if (!(await ensureReady())) return;

  isScanning = true;

  manager.startDeviceScan(
    [SERVICE_UUID],
    { allowDuplicates: true },
    async (err, dev) => {
      try {
        // 기본 스캔 쿨다운
        if (Date.now() - cache.lastSeenAt() < SCAN_COOLDOWN_MS) return;

        cache.markSeen();

        if (err || !dev) return;
        if (!isCandidate(dev)) return;

        const deviceId = cache.getBLEDeviceId();
        const curPhone = cache.getPhone();
        const serial = cache.getSerial();

        if (!deviceId || !curPhone || !serial) return;

        const device = await getDeviceBySerial(serial);
        if (!device) return;

        const { phone: dbPhone } = device;

        if (curPhone === dbPhone) return;

        // 백그라운드로부터 포그라운드 알림 저장(pending...)
        cache.setPending({ deviceId, phoneNumber: curPhone });

        const settings = settingService.getSettings();
        
        // 자동변경 설정이 아닐시 알림
        if (!settings.autoSet) {
          notifyPhoneChange(deviceId, dbPhone, curPhone);
        } else {
          // 자동변경 설정이면 알림 확인 없이 바로 자동 변경
          deviceService.updatePhoneNumber(deviceId, curPhone, serial);
          // 알림 설정이 On이면 백그라운드로부터 변경 알림 해주기
          if (settings.notice) {
            nofifyMessage(curPhone);
          }
        }

        notifyOnScreenToChangePhone(curPhone, deviceId);
      } catch (e) {
        Alert.alert(`[BLE] scan handler error: ${e}`);
      }
    },
  );
}

export function stopBackgroundScan() {
  isScanning = false;
}

const isCandidate = (dev: Device) =>
  !!dev && (dev.name ?? '').startsWith('Parke');
