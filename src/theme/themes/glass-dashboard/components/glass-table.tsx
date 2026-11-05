import { ReactNode } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { GLASS, TEXT } from '../tokens'
import { PRETENDARD } from '@/theme/fonts'

export interface GlassTableColumn<T> {
  key: string
  title: string
  // 칸 너비 비율 (기본 1)
  flex?: number
  align?: 'left' | 'center' | 'right'
  // 글자를 돌려주면 기본 글자 모양으로 그린다
  render: (row: T) => ReactNode
}

interface GlassTableProps<T> {
  columns: GlassTableColumn<T>[]
  rows: T[]
  keyExtractor: (row: T) => string
  onRowPress?: (row: T) => void
}

const ALIGN = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
} as const

// 표 (영상의 Recent Verification Challenges): 대문자 머리줄 + 얇은 구분선 줄들.
// 화면이 좁으면 칸을 3~4개로 줄여 쓴다
export const GlassTable = <T,>({
  columns,
  rows,
  keyExtractor,
  onRowPress,
}: GlassTableProps<T>) => (
  <View>
    <View style={[styles.row, styles.headerRow]}>
      {columns.map(column => (
        <View
          key={column.key}
          style={[
            styles.cell,
            {
              flex: column.flex ?? 1,
              alignItems: ALIGN[column.align ?? 'left'],
            },
          ]}
        >
          <Text style={styles.headerText} numberOfLines={1}>
            {column.title}
          </Text>
        </View>
      ))}
    </View>
    {rows.map(row => (
      <Pressable
        key={keyExtractor(row)}
        disabled={!onRowPress}
        onPress={() => onRowPress?.(row)}
      >
        {({ pressed }) => (
          <View style={[styles.row, styles.bodyRow, pressed && styles.pressed]}>
            {columns.map(column => {
              const content = column.render(row)
              return (
                <View
                  key={column.key}
                  style={[
                    styles.cell,
                    {
                      flex: column.flex ?? 1,
                      alignItems: ALIGN[column.align ?? 'left'],
                    },
                  ]}
                >
                  {typeof content === 'string' ||
                  typeof content === 'number' ? (
                    <Text style={styles.cellText} numberOfLines={1}>
                      {content}
                    </Text>
                  ) : (
                    content
                  )}
                </View>
              )
            })}
          </View>
        )}
      </Pressable>
    ))}
  </View>
)

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerRow: {
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: GLASS.divider,
  },
  bodyRow: {
    minHeight: 52,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: GLASS.divider,
  },
  pressed: {
    backgroundColor: GLASS.pressed,
  },
  cell: {
    justifyContent: 'center',
  },
  headerText: {
    color: TEXT.faint,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 10.5,
    letterSpacing: 1,
  },
  cellText: {
    color: TEXT.secondary,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 13,
  },
})
