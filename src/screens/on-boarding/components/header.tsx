import { LogoText } from '@/components'
import { StyleSheet, View } from 'react-native'
export const Header = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <LogoText letterSpacing={5.8} fontSize={21} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
})
