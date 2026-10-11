import { StatusBar, StyleSheet, useColorScheme } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { UserContextProvider } from '@/contexts'
import { useAppViewModel } from '@/view-model'
import RootNavigator from '@/navigation/root-navigator'

const AppContent = () => {
  useAppViewModel()
  const isDarkMode = useColorScheme() === 'dark'

  return (
    <>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <RootNavigator />
    </>
  )
}

function App() {
  return (
    <GestureHandlerRootView style={styles.handlerView}>
      <SafeAreaProvider>
        <NavigationContainer>
          <BottomSheetModalProvider>
            <UserContextProvider>
              <AppContent />
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
