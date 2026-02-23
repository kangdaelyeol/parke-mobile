import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from '@/navigation/root-navigator';
import { useAppController } from '@/controllers/use-app';
import { BleContextProvider, UserContextProvider } from '@/contexts';
import { AuthContextProvider } from '@/contexts/auth-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <AuthContextProvider>
      <UserContextProvider>
        <BleContextProvider>
          <SafeAreaProvider>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />
            <GestureHandlerRootView>
              <AppContent />
            </GestureHandlerRootView>
          </SafeAreaProvider>
        </BleContextProvider>
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
