import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { Alert } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import {
  SCAN_COOLDOWN_MS,
  SERVICE_UUID,
  RENEW_INTERVAL_MS,
  NOTIFY_COOLDOWN_MS,
} from '@/constants';
import { cache } from '@/storage';
import { notifyPhoneChange } from '@/helpers/notify-phone-change';
import { cardService } from '@/services';
import { nofifyMessage } from '@/helpers/notify-message';
import { settingService } from '@/services';
import { useUserContext } from './user-context';
import { getDeviceId } from '@/helpers';
import { extractNumber, notifyChangePhoneOnScreen } from '@/utils';

interface BleContextValue {
  actions: {
    startBackgroundScan: () => Promise<void>;
    stopBleScan: (session: number) => Promise<void>;
  };
  state: {
    bleManager: BleManager | null;
    isBackgroundScanning: boolean;
    scanSessionRef: React.RefObject<number>;
    searchBleRef: React.RefObject<boolean>;
  };
}

const BleContext = createContext({} as BleContextValue);
const g = globalThis as any;

const isCandidate = (dev: Device) =>
  !!dev && (dev.name ?? '').startsWith('Parke');

export const BleContextProvider = ({ children }: PropsWithChildren) => {
  const { user, cards, setCards } = useUserContext();
  const bleManagerRef = useRef<BleManager | null>(null);
  const scanSessionRef = useRef(0);

  useEffect(() => {
    bleManagerRef.current ??= new BleManager({
      restoreStateIdentifier: 'com.app.ble',
      restoreStateFunction: async _restored => {
        try {
          g.__BLE_SHOULD_START_SCAN__ = true;
        } catch (err) {
          console.warn('Restore callback before JS ready:', err);
        }
      },
    });

    return () => {
      bleManagerRef.current?.destroy();
      bleManagerRef.current = null;
    };
  }, []);

  const cardsRef = useRef(cards);
  const userRef = useRef(user);
  const bgScanRef = useRef(false);
  const searchBleRef = useRef(false);

  useEffect(() => {
    cardsRef.current = cards;
  }, [cards]);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // temp - 디바이스 조회 잘 되나 확인하기 위함

  const actions = {
    startBackgroundScan: useCallback(async () => {
      scanSessionRef.current++;
      const bleManager = bleManagerRef.current;
      if (bgScanRef.current) return;
      // const a = await ensureReady();
      // console.log(a);
      // if (!(await ensureReady())) return;
      if (!bleManager) return;

      bgScanRef.current = true;

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

            const cardsNow = cardsRef.current;
            const userNow = userRef.current;

            device = await dev.connect();
            await device.discoverAllServicesAndCharacteristics();
            const deviceId = await getDeviceId(device);
            const card = cardsNow.find(c => c.deviceId === deviceId);
            if (!card) return;
            console.log('find: ', card);

            // 카드의 번호와 자신의 번호와 일치하면 현재 시점을 마킹하고 종료.
            if (String(userNow.phone) === String(card.phone)) {
              // updatedAt값 갱신
              await cardService.updateUpdatedAt(card.id);
              return;
            }

            // 업데이트 이후 일정 시간동안 db갱신이 안되어 있으면 운전중이 아니므로 다른 번호로 업데이트 진행.
            // 그렇지 않으면 운전중이기 때문에 updatedAt값 갱신을 함. 따라서 다른 번호로 업데이트를 진행하지 않음.
            if (Date.now() < Number(card.updatedAt) + RENEW_INTERVAL_MS) return;

            const settings = settingService.getSettings();

            console.log('settings: ', settings);

            // 자동변경 설정이 아닐시 알림
            if (!settings.autoSet || !card.autoChange) {
              // 이전에 변경 거부가 있었는지 확인
              if (Date.now() < cache.lastDeniedAt() + NOTIFY_COOLDOWN_MS)
                return;

              // 백그라운드로부터 포그라운드 알림 저장(pending...)
              cache.setPending({ cardId: card.id, phone: userNow.phone });

              notifyPhoneChange(card.phone, userNow.phone, card.deviceId);

              // 앱이 실행중이면 앱 스크린에서 알림
              notifyChangePhoneOnScreen(card.id, userNow.phone, setCards);
            } else {
              // 자동변경 설정이면 알림 확인 없이 바로 자동 변경
              const res = await cardService.updatePhone(
                card.id,
                extractNumber(userNow.phone),
              );
              if (!res) {
                Alert.alert('정보 업데이트 중 네트워크에 문제가 발생했습니다.');
                return;
              }
              setCards(prev => {
                const newCards = [...prev];
                const index = newCards.findIndex(c => c.id === card.id);
                if (index === -1) return prev;
                newCards[index].phone = userNow.phone;
                return newCards;
              });
              // 알림 설정이 On이면 백그라운드로부터 변경 알림 해주기
              if (settings.notice) {
                nofifyMessage(userNow.phone);
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
    }, [setCards]),

    stopBleScan: useCallback(
      async (session: number) => {
        console.log(session);
        if (scanSessionRef.current !== session) return;
        if (!bleManagerRef.current) return;
        console.log('stopScanning');
        bgScanRef.current = false;
        searchBleRef.current = false;
        await bleManagerRef.current.stopDeviceScan();
      },
      [bleManagerRef],
    ),
  };

  return (
    <BleContext.Provider
      value={{
        actions,
        state: {
          bleManager: bleManagerRef.current,
          isBackgroundScanning: bgScanRef.current,
          scanSessionRef,
          searchBleRef
        },
      }}
    >
      {children}
    </BleContext.Provider>
  );
};

export const useBleContext = () => useContext(BleContext);
