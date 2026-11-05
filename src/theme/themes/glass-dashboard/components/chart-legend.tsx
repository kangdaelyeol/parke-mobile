import { memo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TEXT, Tone, TONE } from '../tokens'
import { PRETENDARD } from '@/theme/fonts'

export interface LegendItem {
  color: string
  label: string
  value?: string
}

interface ChartLegendProps {
  items: LegendItem[]
  // column: 한 줄에 하나, 값은 오른쪽 끝 (영상 도넛 아래)
  // row: 옆으로 이어서, 값은 이름 뒤 괄호 안 굵게 (영상 Analytics 차트 아래)
  direction?: 'column' | 'row'
}

// 차트 범례: 색 점 + 이름 + 값
export const ChartLegend = memo(
  ({ items, direction = 'column' }: ChartLegendProps) =>
    direction === 'column' ? (
      <View style={styles.column}>
        {items.map(item => (
          <View key={item.label} style={styles.columnRow}>
            <View style={[styles.dot, { backgroundColor: item.color }]} />
            <Text style={styles.label} numberOfLines={1}>
              {item.label}
            </Text>
            {!!item.value && <Text style={styles.value}>{item.value}</Text>}
          </View>
        ))}
      </View>
    ) : (
      <View style={styles.row}>
        {items.map(item => (
          <View key={item.label} style={styles.rowItem}>
            <View style={[styles.dot, { backgroundColor: item.color }]} />
            <Text style={styles.inlineLabel}>
              {item.label}
              {!!item.value && (
                <>
                  {' ('}
                  <Text style={styles.inlineValue}>{item.value}</Text>
                  {')'}
                </>
              )}
            </Text>
          </View>
        ))}
      </View>
    ),
)

interface HighlightStatProps {
  label: string
  value: string
  tone?: Tone
}

// 이름 + 색 강조 값 (영상의 Global SLA Reliability: 99.99%)
export const HighlightStat = memo(
  ({ label, value, tone = 'success' }: HighlightStatProps) => (
    <Text style={styles.inlineLabel}>
      {label}{' '}
      <Text style={[styles.highlight, { color: TONE[tone] }]}>{value}</Text>
    </Text>
  ),
)

const styles = StyleSheet.create({
  column: {
    gap: 10,
  },
  columnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 14,
    rowGap: 6,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  label: {
    flex: 1,
    color: TEXT.secondary,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 13,
  },
  value: {
    color: TEXT.strong,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 13,
  },
  inlineLabel: {
    color: TEXT.tertiary,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 12,
  },
  inlineValue: {
    color: TEXT.primary,
    fontFamily: PRETENDARD.BOLD,
  },
  highlight: {
    fontFamily: PRETENDARD.BOLD,
  },
})
