import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { startBackgroundScan } from '@/ble-manager';
import { cache } from '@/storage';
import { deviceService, settingService } from '@/services';
import Header from './components/header';
import Main from './components/main';
import OptionModal from './components/option-modal';
import { CardOptionModalProvider } from '@/contexts/card-option-modal-context';
import Footer from './components/footer';

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
    <CardOptionModalProvider>
      <View style={styles.container}>
        <Header />
        <Main />
        <Footer />
      </View>
      <OptionModal />
    </CardOptionModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
