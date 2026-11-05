import { StyleSheet, View } from 'react-native'
import { ConsentMain, Header } from '@setting/components'
import { SCREEN_BACKGROUND } from '@/theme/color'

export default function ConsentSettingScreen() {
  return (
    <View style={styles.container}>
      <Header title="선택 동의 관리" back />
      <ConsentMain />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: SCREEN_BACKGROUND,
    flex: 1,
  },
})
