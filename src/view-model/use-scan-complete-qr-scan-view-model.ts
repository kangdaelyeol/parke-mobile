import { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import {
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import { useScanCompleteContext } from '@/contexts';
import { PARKE_WEB_URL } from '@/constants';
import { ScanCompleteQrScanViewModel } from '@scan-complete/types';

export const useScanCompleteQrScanViewModel =
  (): ScanCompleteQrScanViewModel => {
    const device = useCameraDevice('back');
    const { hasPermission, requestPermission } = useCameraPermission();
    const [scanned, setScanned] = useState(false);

    const { actions: scanCompleteActions } = useScanCompleteContext();

    useEffect(() => {
      (async () => {
        if (!hasPermission) {
          const res = await requestPermission();
          if (!res) Alert.alert('카메라 권한이 필요합니다.');
          scanCompleteActions.scanBackPress();
        }
      })();
    }, [hasPermission, requestPermission, scanCompleteActions]);

    const codeScanner = useMemo(
      () => ({
        codeTypes: ['qr'],
        onCodeScanned: (codes: any[]) => {
          if (scanned) return;
          setScanned(true);
          const v = codes?.[0].value;
          if (!v) return;
          const scannedUrl = String(v);
          if (!scannedUrl.startsWith(PARKE_WEB_URL)) {
            Alert.alert(
              '잘못된 QR코드를 스캔했습니다.\n다시 시도하거나 시리얼 번호를 직접 입력해주세요.',
            );
            return scanCompleteActions.scanBackPress();
          }
          const serial = scannedUrl.split('/').at(-1);
          scanCompleteActions.serialScan(serial as string);
        },
      }),
      [scanCompleteActions, scanned],
    );

    return {
      state: { device, hasPermission, scanned },
      actions: {
        codeScanner,
        scanBackPress: scanCompleteActions.scanBackPress,
      },
    };
  };
