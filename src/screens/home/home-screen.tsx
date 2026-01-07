import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { startBackgroundScan } from '@/ble-manager';
import { cache } from '@/storage';
import { deviceService, settingService } from '@/services';
import { LogoIcon } from '@/assets/logo';
import { useNavigation } from '@react-navigation/native';

const tempData = {
  id: 'cardIdTest',
  active: true,
  phone: '01024130510',
};

const EmptyCard = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={cardStyles.container}>
      <View style={cardStyles.iconContainer}>
        <View style={cardStyles.emptyCardIcon}>
          <FontAwesome6
            name="plus"
            iconStyle="solid"
            size={20}
            color={'gray'}
          />
        </View>
      </View>
      <Pressable onPress={() => navigation.replace('SearchBLE')}>
        {({ pressed }) => (
          <View
            style={[cardStyles.emptyCard, pressed && { opacity: 0.4 }]}
          ></View>
        )}
      </Pressable>
    </View>
  );
};

const cardStyles = StyleSheet.create({
  container: {
    position: 'relative',
    marginHorizontal: 'auto',
    width: 250,
    height: 140,
  },
  emptyCard: {
    width: 250,
    height: 140,
    borderRadius: 20,
    backgroundColor: 'gray',
    opacity: 0.2,
    borderWidth: 1,
    borderColor: 'white',
    borderStyle: 'dashed',
  },
  iconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 250,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCardIcon: {
    width: 30,
    height: 30,
    opacity: 0.6,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    margin: 'auto',
  },
});

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
      <View style={styles.header}>
        <View style={styles.headerWrapper}>
          <LogoIcon width={60} height={60} />
          <Pressable
            style={styles.settingBtn}
            onPress={() => {
              cache.setHasSeenOnBoarding(false);
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
        </View>
      </View>
      <View style={styles.main}>
        <View style={styles.mainWrapper}>
          <View style={styles.cardContainer}>
            <EmptyCard />
          </View>
        </View>
      </View>

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
    maxWidth: 400,
    marginHorizontal: 'auto',
  },

  cardContainer: {
    height: 400,
    marginTop: 30,
  },

  btn: {
    // position: 'absolute',
    // bottom: 40,
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
    top: 12,
    right: 20,
  },
  header: {
    // backgroundColor: 'white',
    width: '100%',
  },
  headerWrapper: {
    marginTop: 40,
    boxSizing: 'border-box',
    height: 60,
    position: 'relative',
    width: '100%',
    maxWidth: 400,
    marginHorizontal: 'auto',
  },
  footer: {
    position: 'absolute',
    bottom: -1,
    width: '102%',
    backgroundColor: '#17171c',
    height: 90,
    borderTopStartRadius: 35,
    borderTopEndRadius: 35,
    borderColor: '#212129',
    borderWidth: 1.5,
  },
  footerWrapper: {
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 30,
    marginHorizontal: 'auto',
    height: 10,
  },
});
