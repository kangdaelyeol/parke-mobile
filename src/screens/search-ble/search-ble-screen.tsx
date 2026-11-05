import { StyleSheet, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Footer, Header, Radar, Title } from '@search-ble/components'
import { SearchBleProvider } from '@search-ble/contexts'
import { useSearchBleViewModel } from '@search-ble/view-model'
import { SCREEN_BACKGROUND } from '@/theme/color'

const SearchBleContent = () => {
  useSearchBleViewModel()
  return (
    <View style={styles.container}>
      <Header />
      <KeyboardAwareScrollView enableOnAndroid={true}>
        <View style={styles.scrollView}>
          <Title />
          <Radar />
        </View>
      </KeyboardAwareScrollView>
      <Footer />
    </View>
  )
}

export default function SearchBleScreen() {
  return (
    <SearchBleProvider>
      <SearchBleContent />
    </SearchBleProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: SCREEN_BACKGROUND,
  },
  scrollView: {
    minHeight: 700,
  },
})
