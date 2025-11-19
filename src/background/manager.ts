// manager.ts
import { BleManager, Device, State } from 'react-native-ble-plx';
import { SERVICE_UUID } from '../constants';
import { cache } from '../storage';
import { notifyPhoneChange } from '../helpers/notify-phone-change';
import { Alert } from 'react-native';
import { deviceService } from '../services';

const { getPhoneNumber } = deviceService;

const COOLDOWN_MS = 10 * 1000;

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
        if (err || !dev) return;
        if (!isCandidate(dev)) return;

        const deviceId = cache.getBLEDeviceId() || 'abc';
        const curPhone = cache.getPhone() || '01024130000';

        if (!deviceId || !curPhone) return;

        const dbPhone = await getPhoneNumber(deviceId);
        if (!dbPhone) return;

        if (curPhone === dbPhone) return;

        if (Date.now() - cache.lastSeenAt(deviceId) < COOLDOWN_MS) return;

        // 알림 쿨다운 기록
        cache.markSeen(deviceId);

        // 알림
        await notifyPhoneChange(deviceId, dbPhone, curPhone); // test - oldPhone === new phone
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
