import { StyleSheet, View } from 'react-native'
import { Loading } from '@/components'
import { InitContextProvider, useInitContext } from '@/contexts'
import { Main, Footer, Header } from './components'

const InitContent = () => {
  const { state } = useInitContext()
  return (
    <View style={styles.container}>
      {state.loading && <Loading />}
      <Header />
      <Main />
      <Footer />
    </View>
  )
}

export default function InitScreen() {
  return (
    <InitContextProvider>
      <InitContent />
    </InitContextProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
})
