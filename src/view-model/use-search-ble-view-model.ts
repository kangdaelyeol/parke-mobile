import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useBleContext, useSearchBleContext } from '@/contexts';
import { ensurePermissions } from '@/helpers';
import { SearchBleScreenViewModel } from '@search-ble/types';

export const useSearchBleViewModel = (): SearchBleScreenViewModel => {
  const { state: searchBleState, actions: searchBleActions } =
    useSearchBleContext();
  const { state: bleState, actions: bleActions } = useBleContext();
  // temp - 디바이스 조회 잘 되나 확인하기 위함

  useEffect(() => {
    let sub: { remove: () => void } | undefined;
    const nowSession = bleState.scanSessionRef.current + 1;

    (async () => {
      const ok = await ensurePermissions();
      if (!ok) {
        Alert.alert('권한 필요', 'BLE 권한을 허용해주세요');
        return;
      }

      sub = bleState.bleManagerRef.current?.onStateChange(state => {
        console.log(state);
        if (state === 'PoweredOn') {
          searchBleActions.startSearchBle();
          sub?.remove();
        }
      }, true);
    })();
    return () => {
      sub?.remove();
      bleActions.stopBleScan(nowSession);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    state: {
      rssi: searchBleState.rssi,
      devices: searchBleState.devices,
    },
    actions: {},
  };
};
