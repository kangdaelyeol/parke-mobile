import { PropsWithChildren } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { DARK, DARK_LIGHT } from '@/theme/color'
import { glassStyles } from '@/theme/glass'
import { useThemed } from '@/theme/themed'

// 설정 항목 묶음. 기본 테마: 어두운 판 / 글래스: 유리 판
export const ItemList = ({ children }: PropsWithChildren) => {
  const style = useThemed<StyleProp<ViewStyle>>({
    classic: classic.container,
    'glass-dashboard': [glassStyles.surface, styles.container],
  })
  return <View style={style}>{children}</View>
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    borderRadius: 18,
    marginTop: 12,
    overflow: 'hidden',
  },
})

// 기본 테마 (처음 디자인)
const classic = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: DARK,
    borderRadius: 15,
    marginTop: 15,
    borderWidth: 1.5,
    borderColor: DARK_LIGHT,
    overflow: 'hidden',
  },
})
