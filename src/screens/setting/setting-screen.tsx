import { StyleSheet, View } from 'react-native'
import { Header, Main } from '@setting/components'
import { TermBottomSheet } from '@/components'
import { SettingContextProvider, useSettingContext } from '@/contexts'

const SettingScreenContent = () => {
  const { modalRef, docType } = useSettingContext()
  return (
    <View style={styles.container}>
      <Header />
      <Main />
      <TermBottomSheet modalRef={modalRef} docState={docType} />
    </View>
  )
}

export default function SettingScreen() {
  return (
    <SettingContextProvider>
      <SettingScreenContent />
    </SettingContextProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
})
