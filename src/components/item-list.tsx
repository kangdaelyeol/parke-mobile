import { PropsWithChildren } from 'react'
import { StyleSheet, View } from 'react-native'
import { glassStyles } from '@/theme/glass'

// 설정 항목 묶음 (유리 판)
export const ItemList = ({ children }: PropsWithChildren) => {
  return <View style={[glassStyles.surface, styles.container]}>{children}</View>
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    borderRadius: 18,
    marginTop: 12,
    overflow: 'hidden',
  },
})
