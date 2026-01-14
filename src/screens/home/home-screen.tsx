import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { startBackgroundScan } from '@/ble-manager';
import { cache } from '@/storage';
import { deviceService, settingService } from '@/services';

import Header from './components/header';
import { CARD_WIDTH } from './constants';
import Main from './components/main';

export default function HomeScreen() {
  useEffect(() => {
    (async () => {
      const settings = settingService.getSettings();
      const deviceId = cache.getBLEDeviceId();
      const serial = cache.getSerial();

      if (!settings.active || !deviceId || !serial) return;

      const device = await deviceService.getDeviceBySerial(serial);
      if (device && device.deviceId === deviceId) {
        startBackgroundScan();
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      <Main />
      <View style={styles.footer}>
        <View style={styles.footerWrapper}></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  main: {
    width: '100%',
  },
  mainWrapper: {
    width: '100%',
    maxWidth: 480,
    marginHorizontal: 'auto',
    overflow: 'hidden',
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: 200,
    marginTop: 30,
    marginHorizontal: 'auto',
  },
  cardSlider: {
    width: CARD_WIDTH,
    maxWidth: CARD_WIDTH,
  },
  cardSliderMover: {
    width: CARD_WIDTH,
    flexDirection: 'row',
    gap: 30,
  },
  btn: {
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    paddingVertical: 14,
    width: 200,
    borderRadius: 10,
  },
  btnText: {
    fontSize: 20,
    color: 'black',
  },

  footer: {
    position: 'absolute',
    bottom: -1,
    width: '102%',
    left: '-1%',
    backgroundColor: '#16181b',
    height: 90,
    borderTopStartRadius: 35,
    borderTopEndRadius: 35,
    borderColor: '#2d2d2d',
    borderWidth: 1,
  },
  footerWrapper: {
    width: '100%',
    maxWidth: 300,
    paddingHorizontal: 30,
    marginHorizontal: 'auto',
    backgroundColor: 'white',
  },
});
