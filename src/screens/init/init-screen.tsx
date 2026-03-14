import { StyleSheet, View } from 'react-native'
import { Loading } from '@/components'
import { useInitViewModel } from '@/view-model'
import { Main, Footer, Header } from './components'

export default function InitScreen() {
  const { state } = useInitViewModel()

  return (
    <View style={styles.container}>
      {state.loading && <Loading />}
      <Header />
      <Main />
      <Footer />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
})
