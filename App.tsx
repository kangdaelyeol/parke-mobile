import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Alert, StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/components/home-screen';
import SearchBLEScreen from './src/components/search-ble-screen';
import ScanComplete from './src/components/scan-complete-screen';
import './src/background/manager';
import { safeStartScan } from './src/background/manager';
import { setupNotifications } from './src/helpers/notify-phone-change';
import notifee, { EventType } from '@notifee/react-native';
import { deviceService } from './src/services';

type RootStackParamList = {
  Home: undefined;
  Details: { userId: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const { updatePhoneNumber } = deviceService;
  useEffect(() => {
    setupNotifications();
    safeStartScan();
    const unsub = notifee.onForegroundEvent(async ({ type, detail }) => {
      if (type !== EventType.ACTION_PRESS && type !== EventType.PRESS) return;

      const actionId = detail.pressAction?.id;
      const { deviceId, newPhone } = detail.notification?.data || {};

      if (actionId === 'confirm' && deviceId && newPhone) {
        try {
          await updatePhoneNumber(String(deviceId), String(newPhone));
        } catch (e) {
          Alert.alert('오류', '전화번호 변경에 실패했습니다.');
        }
      }
    });

    return () => unsub();
  }, []);

  /** TODO: Android 구현 나중에 */
  // useEffect(() => {
  //   if (Platform.OS === 'android') {
  //     startBleForeground(); // 사용자가 동의한 시점에 시작 (권한 OK 후)
  //   }
  //   return () => {
  //     if (Platform.OS === 'android') stopBleForeground();
  //   };
  // }, []);

  // useEffect(() => {
  //   const unsub = notifee.onForegroundEvent(async ({ type, detail }) => {
  //     if (type === EventType.ACTION_PRESS || type === EventType.PRESS) {
  //       const actionId = detail.pressAction?.id;
  //       const { deviceId, newPhone } = detail.notification?.data || {};
  //       if (actionId === 'confirm' && deviceId && newPhone) {
  //         await update(ref(db, `devices/${deviceId}`), {
  //           phone: newPhone,
  //           updatedAt: serverTimestamp(),
  //         });
  //       }
  //       // cancel/default는 무시
  //     }
  //   });
  //   return unsub;
  // }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SearchBLE" component={SearchBLEScreen} />
        <Stack.Screen name="ScanComplete" component={ScanComplete} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
