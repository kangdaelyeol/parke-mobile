import { memo } from 'react'
import { StyleSheet, View } from 'react-native'

interface CardSlotDotsProps {
  // 칸 수 (카드들 + 맨 끝 카드 추가 칸)
  count: number
  // 이 판이 몇 번째 칸인지
  index: number
}

// 내 기기 판 머리줄 오른쪽의 칸 표시 (글래스). 이 판의 자리만 길쭉한 밝은 점이고, 판과 함께 넘어간다
export const CardSlotDots = memo(({ count, index }: CardSlotDotsProps) => (
  <View style={styles.row}>
    {Array.from({ length: count }, (_, i) => (
      <View key={i} style={[styles.dot, i === index && styles.selected]} />
    ))}
  </View>
))

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  selected: {
    width: 14,
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
})
