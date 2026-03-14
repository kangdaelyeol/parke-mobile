import { StyleSheet, View } from 'react-native'
import { DARK_LIGHT } from '@/theme/color'

export const ItemDivider = () => {
  return <View style={styles.divider} />
}

const styles = StyleSheet.create({
  divider: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: DARK_LIGHT,
    height: 1.5,
  },
})
