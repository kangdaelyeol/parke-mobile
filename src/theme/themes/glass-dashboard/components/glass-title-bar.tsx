import { ReactNode } from 'react'
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import { glassStyles, TEXT } from '../tokens'
import { PRETENDARD } from '@/theme/fonts'
import { GlassIconButton } from './glass-icon-button'

interface GlassTitleBarProps {
  title: string
  // 있으면 왼쪽에 ‹ (하위 화면)
  onBack?: () => void
  // 오른쪽에 둘 버튼·알약
  right?: ReactNode
  style?: StyleProp<ViewStyle>
}

// 페이지 제목 막대: 제목도 유리 판 안에 (영상의 상단 바)
export const GlassTitleBar = ({
  title,
  onBack,
  right,
  style,
}: GlassTitleBarProps) => (
  <View
    style={[
      glassStyles.surface,
      styles.bar,
      !!onBack && styles.withBack,
      style,
    ]}
  >
    {onBack && (
      <GlassIconButton round size={34} icon="chevron-left" onPress={onBack} />
    )}
    <Text style={styles.title} numberOfLines={1}>
      {title}
    </Text>
    {right}
  </View>
)

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 54,
    paddingHorizontal: 16,
    borderRadius: 18,
  },
  withBack: {
    paddingLeft: 9,
  },
  title: {
    flex: 1,
    color: TEXT.primary,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 19,
    letterSpacing: -0.3,
  },
})
