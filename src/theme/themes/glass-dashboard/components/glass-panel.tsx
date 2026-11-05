import { ReactNode } from 'react'
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import { glassStyles, glassText } from '../tokens'

interface PanelHeaderProps {
  title: string
  subtitle?: string
  // 오른쪽에 둘 세그먼트·알약·버튼
  right?: ReactNode
  style?: StyleProp<ViewStyle>
}

// 판 머리줄: 제목 + 설명, 오른쪽 조작 (영상 카드마다 맨 위)
export const PanelHeader = ({
  title,
  subtitle,
  right,
  style,
}: PanelHeaderProps) => (
  <View style={[styles.header, style]}>
    <View style={styles.titles}>
      <Text style={glassText.title} numberOfLines={2}>
        {title}
      </Text>
      {!!subtitle && (
        <Text style={glassText.subtitle} numberOfLines={2}>
          {subtitle}
        </Text>
      )}
    </View>
    {right}
  </View>
)

interface GlassPanelProps extends Partial<PanelHeaderProps> {
  children?: ReactNode
}

// 제목이 있는 유리 판 (영상의 차트·도넛·표·로그 카드)
export const GlassPanel = ({
  title,
  subtitle,
  right,
  children,
  style,
}: GlassPanelProps) => (
  <View style={[glassStyles.surface, styles.panel, style]}>
    {!!title && <PanelHeader title={title} subtitle={subtitle} right={right} />}
    {children}
  </View>
)

interface GlassToolbarProps {
  children: ReactNode
  style?: StyleProp<ViewStyle>
}

// 가로 도구 막대 (영상 상단 바: 검색칸 · 기간 세그먼트 · 알림 · 기본 버튼)
export const GlassToolbar = ({ children, style }: GlassToolbarProps) => (
  <View style={[glassStyles.surface, styles.toolbar, style]}>{children}</View>
)

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  titles: {
    flex: 1,
    gap: 4,
  },
  panel: {
    padding: 16,
    gap: 14,
  },
  toolbar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderRadius: 18,
  },
})
