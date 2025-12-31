import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { startBackgroundScan } from '../ble-manager';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { settingService } from '../services/settingService';
import { cache } from '../storage';
import { deviceService } from '../services';

export default function HomeScreen({ navigation }: any) {
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
      <View style={styles.textBox}>
        <Pressable
          style={styles.settingBtn}
          onPress={() => {
            navigation.navigate('Setting');
          }}
        >
          {({ pressed }) => {
            return (
              <FontAwesome6
                name="gear"
                iconStyle="solid"
                size={40}
                style={{ color: pressed ? '#666' : '#fff' }}
              />
            );
          }}
        </Pressable>
        <Text style={styles.upText}>PARKÉ</Text>
        <Text style={styles.downText}>LUXURY</Text>
      </View>
      <Pressable
        style={styles.btn}
        onPress={() => navigation.navigate('SearchBLE')}
      >
        <Text style={styles.btnText}>Start</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 'auto',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'black',
  },
  textBox: {
    width: '100%',
    maxWidth: 1200,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  upText: {
    color: 'white',
    fontSize: 90,
    transform: [{ scaleY: 0.7 }],
    marginVertical: -10,
    letterSpacing: 3,
  },
  downText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 7,
  },
  btn: {
    position: 'absolute',
    bottom: 40,
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
  settingBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
});
