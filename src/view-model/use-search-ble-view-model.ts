import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useSearchBleContext } from '@/contexts';
import { ensurePermissions } from '@/helpers';
import { SearchBleScreenViewModel } from '@search-ble/types';
import { useNavigation } from '@react-navigation/native';
import { SearchBleStackNavigationProp } from '@/navigation/types';
import { bleService } from '@/services';

export const useSearchBleViewModel = (): SearchBleScreenViewModel => {
  const {
    state: searchBleState,
    actions: { setDevices, setRssi },
  } = useSearchBleContext();

  const navigation = useNavigation<SearchBleStackNavigationProp>();

  useEffect(() => {
    let sub: { remove: () => void } | undefined;
    const nowSession = bleService.getSession() + 1;

    (async () => {
      const ok = await ensurePermissions();
      if (!ok) {
        Alert.alert('권한 필요', 'BLE 권한을 허용해주세요');
        return navigation.goBack();
      }

      sub = bleService.getManager().onStateChange(state => {
        console.log(state);
        if (state === 'PoweredOn') {
          bleService.startSearchBle({
            navigation,
            setDevices,
            setRssi,
          });
          sub?.remove();
        }
      }, true);
    })();
    return () => {
      sub?.remove();
      bleService.stopScan(nowSession);
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
