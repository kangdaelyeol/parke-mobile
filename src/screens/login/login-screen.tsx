import { View, StyleSheet } from 'react-native'
import { Loading } from '@/components'
import { LoginContextProvider, useLoginContext } from '@login/contexts'
import { ConsentBottomSheet, Footer, Main } from '@login/components'
import { SCREEN_BACKGROUND } from '@/theme/color'

const LoginContent = () => {
  const { state } = useLoginContext()
  return (
    <View style={styles.container}>
      {state.loading && <Loading />}
      <Main />
      <Footer />
      <ConsentBottomSheet />
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
    backgroundColor: SCREEN_BACKGROUND,
    flex: 1,
  },
})
