import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from '@/navigation/root-navigator';
import { useAppController } from '@/controllers/use-app';
import {
  OnBoardContextProvider,
  useOnBoardContext,
} from '@/contexts/on-board-context';
import { UserContextProvider } from '@/contexts';
import { AuthContextProvider } from '@/contexts/auth-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '@/ble-manager';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <AuthContextProvider>
      <UserContextProvider>
        <OnBoardContextProvider>
          <SafeAreaProvider>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />
            <GestureHandlerRootView>
              <AppContent />
            </GestureHandlerRootView>
          </SafeAreaProvider>
        </OnBoardContextProvider>
      </UserContextProvider>
    </AuthContextProvider>
  );
}

function AppContent() {
  useAppController();
  const { loading } = useOnBoardContext();

  if (loading) return null;

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default App;
