import { Alert } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import {
  BLE_DEVICE_NAME,
  CHAR_UUID,
  NOTIFY_COOLDOWN_MS,
  RENEW_INTERVAL_MS,
  SCAN_COOLDOWN_MS,
  SERVICE_UUID,
} from '@/constants';
import {
  ensurePermissions,
  generateBase64Id,
  getDeviceId,
  nofifyMessage,
  notifyPhoneChange,
} from '@/helpers';
import { SearchBleStackNavigationProp } from '@/navigation/types';
import { cache } from '@/storage';
import { cardService, settingService } from '@/services';
import { extractNumber, notifyChangePhoneOnScreen } from '@/utils';
import { CardDto } from '@/domain/card';
import { UserDto } from '@/domain/user';

const g = globalThis as any;

let scanSession = 0;

const isCandidate = (dev: Device) =>
  !!dev && (dev.name ?? '').startsWith('Parke');

const bleManager = new BleManager({
  restoreStateIdentifier: 'com.app.ble',
  restoreStateFunction: async _restored => {
    try {
      g.__BLE_SHOULD_START_SCAN__ = true;
    } catch (err) {
      console.warn('Restore callback before JS ready:', err);
    }
  },
});

interface StartSearchBleProps {
  navigation: SearchBleStackNavigationProp;
  setDevices: React.Dispatch<React.SetStateAction<any[]>>;
  setRssi: React.Dispatch<React.SetStateAction<string>>;
}

interface StartBackgroundScanProps {
  cards: CardDto[];
  user: UserDto;
  setCards: React.Dispatch<React.SetStateAction<CardDto[]>>;
}

export const bleService = {
  getManager: () => bleManager,
  getSession: () => scanSession,
  updateSession: () => scanSession++,
  stopScan: async (capturedSession: number) => {
    if (bleService.getSession() !== capturedSession) return;
    console.log('stopScanning');
    await bleManager.stopDeviceScan();
  },
  startBackgroundScan: async ({
    cards,
    user,
    setCards,
  }: StartBackgroundScanProps) => {
    console.log('startBackground');

    bleManager.startDeviceScan(
      [SERVICE_UUID],
      { allowDuplicates: true },
      async (err, dev) => {
        let device: Device | null = null;
        try {
          if (err || !dev) return;
          if (!isCandidate(dev)) return;
          // 기본 스캔 쿨다운
          if (Date.now() - cache.lastSeenAt() < SCAN_COOLDOWN_MS) return;
          cache.markSeen();

          device = await dev.connect();
          await device.discoverAllServicesAndCharacteristics();
          const deviceId = await getDeviceId(device);
          const cardState = cards.find(c => c.deviceId === deviceId);
          if (!cardState) return;

          const card = await cardService.get(cardState.id);
          if (!card) return;

          console.log('find: ', card);

          // 카드의 번호와 자신의 번호와 일치하면 현재 시점을 마킹하고 종료.
          if (String(user.phone) === String(card.phone)) {
            // updatedAt값 갱신
            await cardService.updateUpdatedAt(card.id);
            return;
          }

          // 업데이트 이후 일정 시간동안 db갱신이 안되어 있으면 운전중이 아니므로 다른 번호로 업데이트 진행.
          // 그렇지 않으면 운전중이기 때문에 updatedAt값 갱신을 함. 따라서 다른 번호로 업데이트를 진행하지 않음.
          console.log(Number(card.updatedAt) + RENEW_INTERVAL_MS, Date.now());
          if (Date.now() < Number(card.updatedAt) + RENEW_INTERVAL_MS) return;

          const settings = settingService.getSettings();

          console.log('settings: ', settings);

          // 자동변경 설정이 아닐시 알림
          if (!settings.autoSet || !card.autoChange) {
            // 이전에 변경 거부가 있었는지 확인
            if (Date.now() < cache.lastDeniedAt() + NOTIFY_COOLDOWN_MS) return;

            // 백그라운드로부터 포그라운드 알림 저장(pending...)
            cache.setPending({ cardId: card.id, phone: user.phone });

            notifyPhoneChange(card.phone, user.phone, card.deviceId);

            // 앱이 실행중이면 앱 스크린에서 알림
            notifyChangePhoneOnScreen(card.id, user.phone, setCards);
          } else {
            // 자동변경 설정이면 알림 확인 없이 바로 자동 변경
            const res = await cardService.updatePhone(
              card.id,
              extractNumber(user.phone),
            );
            if (!res) {
              Alert.alert('정보 업데이트 중 네트워크에 문제가 발생했습니다.');
              return;
            }
            setCards(prev => {
              const newCards = [...prev];
              const index = newCards.findIndex(c => c.id === card.id);
              if (index === -1) return prev;
              newCards[index].phone = user.phone;
              return newCards;
            });
            // 알림 설정이 On이면 백그라운드로부터 변경 알림 해주기
            if (settings.notice) {
              nofifyMessage(user.phone);
            }
          }
        } catch (e) {
          Alert.alert(`[BLE] scan handler error: ${e}`);
        } finally {
          try {
            await device?.cancelConnection();
          } catch {}
        }
      },
    );
  },
  startSearchBle: async ({
    navigation,
    setDevices,
    setRssi,
  }: StartSearchBleProps) => {
    bleService.updateSession();
    console.log('startSearchBle');

    const ok = await ensurePermissions();
    if (!ok) {
      Alert.alert('권한 필요', 'BLE 권한을 허용해주세요');
      navigation.goBack();
    }

    bleManager.startDeviceScan(
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
          bleManager.stopDeviceScan();
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
};
