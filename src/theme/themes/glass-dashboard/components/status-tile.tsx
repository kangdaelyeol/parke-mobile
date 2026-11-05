import { memo, ReactNode } from 'react'
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import { glassStyles, TEXT, Tone } from '../tokens'
import { PRETENDARD } from '@/theme/fonts'
import { StatusPill } from './status-pill'

interface StatusTileProps {
  title: string
  subtitle?: string
  // 오른쪽 상태 알약 (영상의 Optimal)
  status?: { label: string; tone?: Tone }
  right?: ReactNode
  style?: StyleProp<ViewStyle>
}

// 판 안에 한 겹 더 놓인 상태 타일 (영상의 Telecom Provider Health 줄)
export const StatusTile = memo(
  ({ title, subtitle, status, right, style }: StatusTileProps) => (
    <View style={[glassStyles.tile, styles.tile, style]}>
      <View style={styles.texts}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {!!subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
      {status && <StatusPill label={status.label} tone={status.tone} />}
      {right}
    </View>
  ),
)

const styles = StyleSheet.create({
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  texts: {
    flex: 1,
    gap: 3,
  },
  title: {
    color: TEXT.strong,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 14,
  },
  subtitle: {
    color: TEXT.tertiary,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 11.5,
  },
})
