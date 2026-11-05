import { ReactNode } from 'react'
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import { glassText } from '../tokens'

interface SectionLabelProps {
  children: string
  // 오른쪽에 둘 알약·버튼
  right?: ReactNode
  style?: StyleProp<ViewStyle>
}

// 묶음 이름 (영상의 MENU, SYSTEM)
export const SectionLabel = ({ children, right, style }: SectionLabelProps) => (
  <View style={[styles.row, style]}>
    <Text style={glassText.sectionLabel}>{children}</Text>
    {right}
  </View>
)

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})
