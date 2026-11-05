import { StyleSheet, View } from 'react-native'
import { DARK_LIGHT } from '@/theme/color'
import { GLASS } from '@/theme/glass'
import { useThemed } from '@/theme/themed'

// 묶음 안 항목 사이 선. 기본 테마: 굵은 어두운 선 / 글래스: 가는 흰 선
export const ItemDivider = () => {
  const style = useThemed({
    classic: styles.classic,
    'glass-dashboard': styles.glass,
  })
  return <View style={style} />
}

const styles = StyleSheet.create({
  classic: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: DARK_LIGHT,
    height: 1.5,
  },
  glass: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: GLASS.divider,
    height: StyleSheet.hairlineWidth,
  },
})
