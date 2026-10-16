import { StyleSheet, View } from 'react-native'
import { CardSettingProvider, SliderContextProvider } from '@home/contexts'
import { Header, Footer, Main } from '@home/components'
import { useHomeViewModel } from '@home/view-model'
import { Loading } from '@/components'

const HomeScreenContent = () => {
  const { state } = useHomeViewModel()

  return (
    <View style={styles.container}>
      {state.loading && <Loading />}
      <Header />
      <Main />
      <Footer />
    </View>
  )
}

export default function HomeScreen() {
  return (
    <CardSettingProvider>
      <SliderContextProvider>
        <HomeScreenContent />
      </SliderContextProvider>
    </CardSettingProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
})
