import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Alert } from 'react-native';
import { BleManager, Device, State } from 'react-native-ble-plx';
import {
  SCAN_COOLDOWN_MS,
  SERVICE_UUID,
  RENEW_INTERVAL_MS,
  NOTIFY_COOLDOWN_MS,
  BLE_DEVICE_NAME,
  CHAR_UUID,
} from '@/constants';
import { cache } from '@/storage';
import { notifyPhoneChange } from '@/helpers/notify-phone-change';
import { cardService } from '@/services';
import { nofifyMessage } from '@/helpers/notify-message';
import { settingService } from '@/services';
import { useUserContext } from './user-context';
import { getDeviceId, generateBase64Id } from '@/helpers';
import { notifyChangePhoneOnScreen } from '@/utils';
import { SearchBleStackNavigationProp } from '@/navigation/types';
import { useNavigation } from '@react-navigation/native';

interface BleContextValue {
  actions: {
    startBackgroundScan: () => Promise<void>;
    stopBackgroundScan: () => void;
    stopBleScan: () => Promise<void>;
    startSearchBle: () => void;
  };
  state: {
    bleManager: BleManager | null;
    devices: any[];
    rssi: string;
  };
}

const BleContext = createContext({} as BleContextValue);
const g = globalThis as any;

const isCandidate = (dev: Device) =>
  !!dev && (dev.name ?? '').startsWith('Parke');

export const BleContextProvider = ({ children }: PropsWithChildren) => {
  const { user, cards } = useUserContext();
  const [bleManager, setBleManager] = useState<null | BleManager>(null);
  const [isScanning, setIsScanning] = useState(false);
  // temp - 디바이스 조회 잘 되나 확인하기 위함
  const [devices, setDevices] = useState<any[]>([]);

  const [rssi, setRssi] = useState('');

  const navigation = useNavigation<SearchBleStackNavigationProp>();

  useEffect(() => {
    setBleManager(
      new BleManager({
        restoreStateIdentifier: 'com.app.ble',
        restoreStateFunction: async _restored => {
          try {
            g.__BLE_SHOULD_START_SCAN__ = true;
          } catch (err) {
            console.warn('Restore callback before JS ready:', err);
          }
        },
      }),
    );
  }, []);

  // Bluetooth PoweredOn/권한 대기
  async function ensureReady(): Promise<boolean> {
    // (안드로이드 12+ 권한 체크/요청은 여기에—생략)
    if (!bleManager) return false;

    let state = await bleManager.state();
    if (state !== State.PoweredOn) {
      await new Promise<void>(resolve => {
        const sub = bleManager.onStateChange(s => {
          if (s === State.PoweredOn) {
            sub.remove();
            resolve();
          }
        }, true);
      });
      state = await bleManager.state();
    }
    return state === State.PoweredOn;
  }

  const actions = {
    startSearchBle: () => {
      setDevices([]);

      bleManager?.startDeviceScan(
        null,
        { allowDuplicates: true },
        async (error, device) => {
          if (error || !device) return;

          /* temp - 디바이스 조회 잘 되나 확인하기 위함 */

          setDevices(prev => {
            const exists = prev.find(d => d.id === device.id);
            if (exists) return prev;
            return [...prev, { id: device.id, name: device.name }];
          });

          if ((device.name ?? '').startsWith(BLE_DEVICE_NAME) === false) return;

          setRssi(String(device.rssi));

          if (!device.rssi || device.rssi < -40) return;

          try {
            bleManager?.stopDeviceScan();
            const d = await device.connect();
            await d.discoverAllServicesAndCharacteristics();
            const deviceId = await getDeviceId(d);
            if (deviceId) {
              navigation.replace('ScanComplete', { value: deviceId });
            } else {
              const base64Id = generateBase64Id();
              await device.writeCharacteristicWithResponseForService(
                SERVICE_UUID,
                CHAR_UUID,
                base64Id,
              );
              navigation.replace('ScanComplete', { value: base64Id });
            }
            await d.cancelConnection();
          } catch (e) {
            console.log(e);
          }
        },
      );
    },
    startBackgroundScan: async () => {
      if (isScanning) return;
      if (!(await ensureReady())) return;
      if (!bleManager) return;

      setIsScanning(true);

      bleManager.startDeviceScan(
        [SERVICE_UUID],
        { allowDuplicates: true },
        async (err, dev) => {
          try {
            // 기본 스캔 쿨다운
            if (Date.now() - cache.lastSeenAt() < SCAN_COOLDOWN_MS) return;
            cache.markSeen();

            if (err || !dev) return;
            if (!isCandidate(dev)) return;

            const device = await dev.connect();
            await device.discoverAllServicesAndCharacteristics();
            const deviceId = await getDeviceId(device);
            const phone = user.phone;
            const card = cards.find(c => c.deviceId === deviceId);
            if (!card) return;

            // 카드의 번호와 자신의 번호와 일치하면 현재 시점을 마킹하고 종료.
            if (phone === card.phone) {
              // updatedAt값 갱신
              await cardService.updateUpdatedAt(card.id);
              return;
            }

            // 업데이트 이후 일정 시간동안 db갱신이 안되어 있으면 운전중이 아니므로 다른 번호로 업데이트 진행.
            // 그렇지 않으면 운전중이기 때문에 updatedAt값 갱신을 함. 따라서 다른 번호로 업데이트를 진행하지 않음.
            if (Date.now() < Number(card.updatedAt) + RENEW_INTERVAL_MS) return;

            const settings = settingService.getSettings();

            // 자동변경 설정이 아닐시 알림
            if (!settings.autoSet) {
              // 이전에 변경 거부가 있었는지 확인
              if (Date.now() < cache.lastDeniedAt() + NOTIFY_COOLDOWN_MS)
                return;

              // 백그라운드로부터 포그라운드 알림 저장(pending...)
              cache.setPending({ phoneNumber: user.phone });

              notifyPhoneChange(card.phone, user.phone, card.deviceId);

              // 앱이 실행중이면 앱 스크린에서 알림
              notifyChangePhoneOnScreen(card.id, user.phone);
            } else {
              // 자동변경 설정이면 알림 확인 없이 바로 자동 변경
              cardService.updatePhone(card.id, user.phone);
              // 알림 설정이 On이면 백그라운드로부터 변경 알림 해주기
              if (settings.notice) {
                nofifyMessage(user.phone);
              }
            }
          } catch (e) {
            Alert.alert(`[BLE] scan handler error: ${e}`);
          }
        },
      );
    },

    stopBackgroundScan: () => {
      setIsScanning(false);
    },
    stopBleScan: async () => {
      await bleManager?.stopDeviceScan();
    },
  };

  return (
    <BleContext.Provider
      value={{
        actions,
        state: {
          bleManager,
          devices,
          rssi,
        },
      }}
    >
      {children}
    </BleContext.Provider>
  );
};

export const useBleContext = () => useContext(BleContext);
