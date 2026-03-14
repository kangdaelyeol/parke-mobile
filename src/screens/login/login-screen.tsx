import { View, StyleSheet } from 'react-native'
import { Loading } from '@/components'
import { useLoginViewModel } from '@/view-model'
import { Footer, Main } from './components'

export default function LoginScreen() {
  const { state } = useLoginViewModel()

  return (
    <View style={styles.container}>
      {state.loading && <Loading />}
      <Main />
      <Footer />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    flex: 1,
  },
})
