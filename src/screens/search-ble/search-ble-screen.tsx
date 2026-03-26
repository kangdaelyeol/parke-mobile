import { StyleSheet, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Footer, Header, Radar, Title } from '@search-ble/components'
import { SearchBleProvider } from '@/contexts'
import { useSearchBleViewModel } from '@/view-model/search-ble'

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
    backgroundColor: '#000',
  },
  scrollView: {
    minHeight: 700,
  },
})
