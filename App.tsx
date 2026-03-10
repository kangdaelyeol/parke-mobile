import { StatusBar, StyleSheet, useColorScheme } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { UserContextProvider } from '@/contexts'
import { useAppViewModel } from '@/view-model'
import RootNavigator from '@/navigation/root-navigator'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'

function App() {
  useAppViewModel()
  const isDarkMode = useColorScheme() === 'dark'

  return (
    <GestureHandlerRootView style={styles.handlerView}>
      <SafeAreaProvider>
        <NavigationContainer>
          <BottomSheetModalProvider>
            <UserContextProvider>
              <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              />
              <RootNavigator />
            </UserContextProvider>
          </BottomSheetModalProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  handlerView: {
    flex: 1,
  },
})

export default App
