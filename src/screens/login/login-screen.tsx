import { View, StyleSheet } from 'react-native'
import { Loading, TermBottomSheet } from '@/components'
import { LoginContextProvider, useLoginContext } from '@/contexts'
import { Footer, Main } from '@/screens/login/components'

const LoginContent = () => {
  const { state } = useLoginContext()
  return (
    <View style={styles.container}>
      {state.loading && <Loading />}
      <Main />
      <Footer />
      <TermBottomSheet docState={state.docType} modalRef={state.modalRef} />
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
