import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/components/home-screen';
import SearchBLEScreen from './src/components/search-ble-screen';
import ScanComplete from './src/components/scan-complete-screen';
import './src/ble-manager';
import SettingScreen from './src/components/setting-screen';
import { useApp } from './src/controllers/use-app';
import onBoardingScreenWithProps from './src/screens/on-boarding/on-boarding-screen';

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
  const { loading, hasSeenOnBoarding, setHasSeenOnBoarding } = useApp();

  if (loading) return null;

  const OnBoardingScreen = onBoardingScreenWithProps({ setHasSeenOnBoarding });

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!hasSeenOnBoarding ? (
          <Stack.Screen name="OnBoarding" component={OnBoardingScreen} />
        ) : (
          <>
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
