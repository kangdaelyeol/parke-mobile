import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from '@/navigation/root-navigator';
import { useAppController } from '@/controllers/use-app';
import { BleContextProvider, UserContextProvider } from '@/contexts';
import { AuthContextProvider } from '@/contexts/auth-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';

function App() {
  useAppController();
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <GestureHandlerRootView style={styles.handlerView}>
      <SafeAreaProvider>
        <NavigationContainer>
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
