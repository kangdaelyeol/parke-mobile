import { StyleSheet, View } from 'react-native'
import { GLASS } from '@/theme/glass'

export const ItemDivider = () => {
  return <View style={styles.divider} />
}

const styles = StyleSheet.create({
  divider: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: GLASS.pressed,
    height: 1,
  },
})
