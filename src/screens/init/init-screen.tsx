import { StyleSheet, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Loading } from '@/components'
import { InitContextProvider, useInitContext } from '@/contexts'
import { Main, Footer, Header } from './components'

const InitContent = () => {
  const { state } = useInitContext()
  return (
    <View style={styles.container}>
      {state.loading && <Loading />}
      <KeyboardAwareScrollView enableOnAndroid extraScrollHeight={150}>
        <Header />
        <Main />
      </KeyboardAwareScrollView>
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
