import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import ensurePermissions from '../helpers/ensure-permissions';
import { BLE_DEVICE_NAME, CHAR_UUID, SERVICE_UUID } from '../constants';
import { Alert } from 'react-native';
import { manager, stopBackgroundScan } from '../ble-manager';
import { generateBase64Id, getDeviceId } from '../helpers';
import { cache } from '../storage';

type ScanStateType = 'NoneScaned' | 'Scaned';

export const useSearchBle = () => {
  // temp - 디바이스 조회 잘 되나 확인하기 위함
  const [devices, setDevices] = useState<any[]>([]);

  const [rssi, setRssi] = useState('');

  const [scanState, setScanState] = useState<ScanStateType>('NoneScaned');

  const navigation = useNavigation<any>();

  const startScan = () => {
    setDevices([]);

    manager.startDeviceScan(
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

        if (!device.rssi) return;

        if (device.rssi < -40) return;

        try {
          manager.stopDeviceScan();
          const d = await device.connect();
          await d.discoverAllServicesAndCharacteristics();
          const deviceId = await getDeviceId(d);
          if (deviceId) {
            cache.setBLEDeviceId(deviceId);
            navigation.replace('ScanComplete', { value: deviceId });
          } else {
            const base64Id = generateBase64Id();
            await device.writeCharacteristicWithResponseForService(
              SERVICE_UUID,
              CHAR_UUID,
              base64Id,
            );
            cache.setBLEDeviceId(base64Id);
            navigation.replace('ScanComplete', { value: base64Id });
          }
          await d.cancelConnection();
        } catch (e) {
          console.log(e);
        }
      },
    );
  };

  useEffect(() => {
    stopBackgroundScan();
    let sub: { remove: () => void } | undefined;
    let unmounted = false;

    (async () => {
      const ok = await ensurePermissions();
      if (!ok || unmounted) {
        Alert.alert('권한 필요', 'BLE 권한을 허용해주세요');
        return;
      }
      await manager.stopDeviceScan();

      sub = manager.onStateChange(state => {
        if (state === 'PoweredOn') {
          startScan();
          sub?.remove();
        }
      }, true);
    })();

    return () => {
      unmounted = true;
      sub?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const moveToHome = () => {
    navigation.replace('Home');
  };

  return { devices, moveToHome, rssi, scanState, setScanState };
};
