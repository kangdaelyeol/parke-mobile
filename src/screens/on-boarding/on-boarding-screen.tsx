import { StyleSheet, View } from 'react-native'
import { Footer, Header, Slider } from '@on-boarding/components'
import { OnBoardingContextProvider } from '@on-boarding/contexts'
import { useOnBoardingViewModel } from '@on-boarding/view-model'
import { Loading } from '@/components'

const OnBoardingContent = () => {
  const { state } = useOnBoardingViewModel()

  return (
    <View style={styles.container}>
      {state.loading && <Loading />}
      <Header />
      <Slider />
      <Footer />
    </View>
  )
}

export default function OnBoardingScreen() {
  return (
    <OnBoardingContextProvider>
      <OnBoardingContent />
    </OnBoardingContextProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    height: '100%',
  },
})
