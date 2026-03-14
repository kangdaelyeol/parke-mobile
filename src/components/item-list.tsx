import { PropsWithChildren } from 'react'
import { StyleSheet, View } from 'react-native'
import { DARK, DARK_LIGHT } from '@/theme/color'
export const ItemList = ({ children }: PropsWithChildren) => {
  return <View style={styles.container}>{children}</View>
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: DARK,
    borderRadius: 15,
    marginTop: 15,
    borderWidth: 1.5,
    borderColor: DARK_LIGHT,
  },
})
