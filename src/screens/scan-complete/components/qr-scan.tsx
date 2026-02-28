import { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import { LogoIcon } from '@/assets/logo';
import { PressableButton } from '@/components';
import { useScanCompleteContext } from '@/contexts';
import { PARKE_WEB_URL } from '@/constants';

export const QrScan = () => {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const [scanned, setScanned] = useState(false);

  const { actions } = useScanCompleteContext();

  useEffect(() => {
    (async () => {
      if (!hasPermission) {
        const res = await requestPermission();
        if (!res) Alert.alert('카메라 권한이 필요합니다.');
        actions.scanBackPress();
      }
    })();
  }, [hasPermission, requestPermission, actions]);

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
          return actions.scanBackPress();
        }
        const serial = scannedUrl.split('/').at(-1);
        actions.serialScan(serial as string);
      },
    }),
    [actions, scanned],
  );

  if (!device)
    return (
      <View style={styles.container}>
        <Text style={styles.text}>카메라를 찾는 중</Text>
        <PressableButton
          pressableStyle={styles.button}
          background={['#202020', '#414141']}
          title="돌아가기"
          onPress={actions.scanBackPress}
        />
      </View>
    );

  if (!hasPermission)
    return (
      <View style={styles.container}>
        <Text style={styles.text}>카메라 권한이 필요합니다</Text>
        <PressableButton
          pressableStyle={styles.button}
          background={['#202020', '#414141']}
          title="돌아가기"
          onPress={actions.scanBackPress}
        />
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <LogoIcon width={50} height={50} style={styles.logo} />
        <Text style={styles.title}>Parke에 각인된 QR 코드를 스캔해주세요</Text>
        <Camera
          codeScanner={codeScanner as any}
          style={styles.camera}
          device={device}
          isActive={!scanned}
        />
        <PressableButton
          pressableStyle={styles.button}
          background={['#202020', '#414141']}
          title="돌아가기"
          onPress={actions.scanBackPress}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    backgroundColor: '#000',
  },
  wrapper: {
    marginHorizontal: 'auto',
    width: '100%',
    paddingHorizontal: 10,
    maxWidth: 360,
  },
  text: {
    color: 'white',
    fontSize: 20,
  },
  camera: {
    marginTop: 30,
    height: 300,
    borderRadius: 10,
    overflow: 'hidden',
  },
  title: {
    marginTop: 25,
    fontSize: 20,
    color: '#eee',
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
  },
  logo: {
    marginTop: 10,
    marginHorizontal: 'auto',
  },
});
