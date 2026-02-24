import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from '@/navigation/root-navigator';
import { useAppController } from '@/controllers/use-app';
import { BleContextProvider, UserContextProvider } from '@/contexts';
import { AuthContextProvider } from '@/contexts/auth-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { navigationRef } from '@/navigation/navigation-ref';

function App() {
  useAppController();
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <GestureHandlerRootView style={styles.handlerView}>
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef}>
          <AuthContextProvider>
            <UserContextProvider>
              <BleContextProvider>
                <StatusBar
                  barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                />
                <RootNavigator />
              </BleContextProvider>
            </UserContextProvider>
          </AuthContextProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  handlerView: {
    flex: 1,
  },
});

export default App;
