import { StyleSheet, View } from 'react-native'
import { Footer, Header, Radar, Title } from '@search-ble/components'
import { SearchBleProvider } from '@/contexts'

export default function SearchBleScreen() {
  return (
    <SearchBleProvider>
      <View style={styles.container}>
        <Header />
        <Title />
        <Radar />
        <Footer />
      </View>
    </SearchBleProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#000',
  },
})
