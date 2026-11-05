import { ReactNode } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { glassStyles } from '../tokens'
import { SectionLabel } from './section-label'

interface GlassSectionProps {
  title: string
  // 제목 오른쪽 알약·버튼
  right?: ReactNode
  children?: ReactNode
  style?: StyleProp<ViewStyle>
}

// 제목이 판 안 맨 위에 들어간 묶음 (영상의 카드처럼 제목도 유리 안에).
// 안의 목록 줄은 판 가장자리까지 닿고, 제목은 줄의 글자와 같은 선에 맞춘다
export const GlassSection = ({
  title,
  right,
  children,
  style,
}: GlassSectionProps) => (
  <View style={[glassStyles.surface, styles.section, style]}>
    <SectionLabel style={styles.label} right={right}>
      {title}
    </SectionLabel>
    {children}
  </View>
)

const styles = StyleSheet.create({
  section: {
    borderRadius: 18,
    overflow: 'hidden',
    paddingTop: 14,
  },
  label: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
})
