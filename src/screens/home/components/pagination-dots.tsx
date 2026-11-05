import { StyleSheet, View } from 'react-native'
import { useCardSliderContext } from '@home/contexts'
import { useUserContext } from '@/contexts'
import { DARK_LIGHT, GRAY } from '@/theme/color'

interface DotProps {
  selected: boolean
  key: number
}

// 기본 테마 카드 아래의 페이지 점 (글래스는 내 기기 판 머리줄의 칸 표시를 쓴다)
const Dot = ({ selected }: DotProps) => (
  <View style={[styles.dot, selected && styles.selected]} />
)

export const PaginationDots = () => {
  const { cards } = useUserContext()
  const { selectedCardIdx } = useCardSliderContext()

  const dotList: DotProps[] = []
  for (let i = 0; i < cards.length + 1; i++) {
    dotList.push({ selected: i === selectedCardIdx, key: i })
  }

  return (
    <View style={styles.container}>
      {dotList.map(v => (
        <Dot key={v.key} selected={v.selected} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: DARK_LIGHT,
  },
  selected: {
    backgroundColor: GRAY,
  },
  container: {
    position: 'absolute',
    bottom: -20,
    marginHorizontal: 'auto',
    marginTop: 15,
    flexDirection: 'row',
    gap: 7,
    left: 0,
    right: 0,
    justifyContent: 'center',
  },
})
