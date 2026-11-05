import { StyleSheet, View } from 'react-native'
import { Footer, Header, Main } from '@permission/components'
import { SCREEN_BACKGROUND } from '@/theme/color'

export default function PermissionScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <Main />
      <Footer />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SCREEN_BACKGROUND,
  },
})
