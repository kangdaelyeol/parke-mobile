import { StyleSheet, View } from 'react-native'
import { Main, Header } from '@profile/components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <KeyboardAwareScrollView enableOnAndroid extraScrollHeight={100}>
        <Main />
      </KeyboardAwareScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    flex: 1,
  },
})
