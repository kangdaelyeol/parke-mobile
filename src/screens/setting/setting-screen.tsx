import { StyleSheet, View } from 'react-native'
import { Header, Main } from '@setting/components'
import { SCREEN_BACKGROUND } from '@/theme/color'
export default function SettingScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <Main />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: SCREEN_BACKGROUND,
    flex: 1,
  },
})
