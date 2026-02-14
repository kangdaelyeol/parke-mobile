import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from '@/navigation/root-navigator';
import { useAppController } from '@/controllers/use-app';
import { UserContextProvider } from '@/contexts';
import { AuthContextProvider } from '@/contexts/auth-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '@/ble-manager';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <AuthContextProvider>
      <UserContextProvider>
        <SafeAreaProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <GestureHandlerRootView>
            <AppContent />
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </UserContextProvider>
    </AuthContextProvider>
  );
}

function AppContent() {
  useAppController();

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default App;
