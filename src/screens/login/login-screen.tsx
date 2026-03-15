import { View, StyleSheet } from 'react-native'
import { Loading } from '@/components'
import { Footer, Main } from './components'
import { LoginContextProvider, useLoginContext } from '@/contexts'

const LoginContent = () => {
  const { state } = useLoginContext()
  return (
    <View style={styles.container}>
      {state.loading && <Loading />}
      <Main />
      <Footer />
    </View>
  )
}

export default function LoginScreen() {
  return (
    <LoginContextProvider>
      <LoginContent />
    </LoginContextProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    flex: 1,
  },
})
