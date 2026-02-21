import { LogoIcon } from '@/assets/logo';
import { PressableButton } from '@/components';
import { useScanCompleteContext } from '@/contexts';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';

export const QrScan = () => {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const [scanned, setScanned] = useState(false);

  const { actions } = useScanCompleteContext();
  
  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission, requestPermission]);

  const codeScanner = useMemo(
    () => ({
      codeTypes: ['qr'],
      onCodeScanned: (codes: any[]) => {
        const v = codes?.[0].value;
        if (!v) return;
        console.log(v);
        setScanned(true);
      },
    }),
    [],
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
