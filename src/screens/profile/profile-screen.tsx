import { StyleSheet, View } from 'react-native'
import { Main, Header } from '@profile/components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useTabBarLayout } from '@/hooks'

export default function ProfileScreen() {
  const { space } = useTabBarLayout()
  return (
    <View style={styles.container}>
      <Header />
      {/* 아래 탭바에 가리지 않도록 탭바만큼 비워 둔다 */}
      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={100}
        contentContainerStyle={{ paddingBottom: space }}
      >
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
