import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import ensurePermissions from '../helpers/ensure-permissions';
import { Buffer } from 'buffer';
import { CHAR_UUID, SERVICE_UUID } from '../constants';
import { Alert } from 'react-native';
import { manager, stopBackgroundScan } from '../background/manager';

export const useSearchBle = () => {
  // temp - 디바이스 조회 잘 되나 확인하기 위함
  const [devices, setDevices] = useState<any[]>([]);

  const navigation = useNavigation<any>();

  const startScan = () => {
    setDevices([]);

    manager.startDeviceScan(
      null,
      { allowDuplicates: true },
      async (error, device) => {
        if (error || !device) return;

        // temp - 디바이스 조회 잘 되나 확인하기 위함
        setDevices(prev => {
          const exists = prev.find(d => d.id === device.id);
          if (exists) return prev;
          return [...prev, { id: device.id, name: device.name }];
        });

        if ((device.name ?? '').startsWith('Parke') === false) return;

        try {
          manager.stopDeviceScan();
          const d = await device.connect();
          await d.discoverAllServicesAndCharacteristics();

          const ch = await d.readCharacteristicForService(
            SERVICE_UUID,
            CHAR_UUID,
          );

          const deviceId = Buffer.from(ch.value ?? '', 'base64').toString(
            'utf-8',
          );

          if (deviceId === 'abc')
            navigation.replace('ScanComplete', { value: deviceId });
          else {
            setDevices(prev => {
              return [...prev, { id: deviceId, name: deviceId }];
            });
          }
          await d.cancelConnection();
        } catch {}
      },
    );
  };

  useEffect(() => {
    manager.stopDeviceScan();
    stopBackgroundScan();
    let sub: { remove: () => void } | undefined;
    let unmounted = false;

    (async () => {
      const ok = await ensurePermissions();
      if (!ok || unmounted) {
        Alert.alert('권한 필요', 'BLE 권한을 허용해주세요');
        return;
      }

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

  return { devices, moveToHome};
};
