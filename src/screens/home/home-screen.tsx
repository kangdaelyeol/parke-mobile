import { StyleSheet, View } from 'react-native'
import {
  CardSettingProvider,
  SliderContextProvider,
  HomeProvider,
} from '@/contexts'
import { Header, Footer, Main } from '@home/components'
import { useHomeViewModel } from '@/view-model/home'
import { Loading } from '@/components'

const HomeScreenContent = () => {
  const { state } = useHomeViewModel()

  return (
    <View style={styles.container}>
      {state.loading && <Loading />}
      <Header />
      <View style={styles.divider} />
      <Main />
      <Footer />
    </View>
  )
}

export default function HomeScreen() {
  return (
    <HomeProvider>
      <CardSettingProvider>
        <SliderContextProvider>
          <HomeScreenContent />
        </SliderContextProvider>
      </CardSettingProvider>
    </HomeProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  divider: {
    height: 1,
    width: '90%',
    backgroundColor: '#2a2a2a',
    marginVertical: 15,
    marginHorizontal: 'auto',
  },
})
