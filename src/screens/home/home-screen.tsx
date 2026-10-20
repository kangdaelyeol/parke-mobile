import { StyleSheet, View } from 'react-native'
import { CardSettingProvider, SliderContextProvider } from '@home/contexts'
import { Header, Footer, Main } from '@home/components'
import { useHomeViewModel } from '@home/view-model'

const HomeScreenContent = () => {
  const { state } = useHomeViewModel()

  return (
    <View style={styles.container}>
      <Header />
      {/* 로딩은 화면 전체가 아니라 카드 영역에서만 보여준다 */}
      <Main loading={state.loading} />
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
