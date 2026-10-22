import { StyleSheet, View } from 'react-native'
import { ConsentMain, Header } from '@setting/components'

export default function ConsentSettingScreen() {
  return (
    <View style={styles.container}>
      <Header title="선택 동의 관리" />
      <ConsentMain />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
})
