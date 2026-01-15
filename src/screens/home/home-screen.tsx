import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { startBackgroundScan } from '@/ble-manager';
import { cache } from '@/storage';
import { deviceService, settingService } from '@/services';
import Header from './components/header';
import Main from './components/main';
import OptionModal from './components/option-modal';
import { CardSettingBottomSheetProvider } from '@/contexts/card-setting-bottom-sheet-context';
import Footer from './components/footer';
import SliderContextProvider from '@/contexts/slider-context';

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
    <CardSettingBottomSheetProvider>
      <SliderContextProvider>
        <View style={styles.container}>
          <Header />
          <Main />
          <Footer />
        </View>
        <OptionModal />
      </SliderContextProvider>
    </CardSettingBottomSheetProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
