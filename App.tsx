import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen, OnBoardingScreen } from '@/screens';
import { useApp } from '@/controllers/use-app';
import {
  OnBoardContextProvider,
  useOnBoard,
} from '@/contexts/on-board-context';
import '@/ble-manager';

// ToDo => move to screens dir with renew
import SearchBLEScreen from './src/components/search-ble-screen';
import ScanComplete from './src/components/scan-complete-screen';
import SettingScreen from './src/components/setting-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UserContextProvider } from '@/contexts';
import Login from '@/screens/login/main';

type RootStackParamList = {
  Home: undefined;
  Details: { userId: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <UserContextProvider>
      <OnBoardContextProvider>
        <SafeAreaProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <GestureHandlerRootView>
            <AppContent />
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </OnBoardContextProvider>
    </UserContextProvider>
  );
}

function AppContent() {
  useApp();
  const { loading, hasSeenOnBoarding } = useOnBoard();

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!hasSeenOnBoarding ? (
          <Stack.Screen name="OnBoarding" component={OnBoardingScreen} />
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="SearchBLE" component={SearchBLEScreen} />
            <Stack.Screen name="ScanComplete" component={ScanComplete} />
            <Stack.Screen name="Setting" component={SettingScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
