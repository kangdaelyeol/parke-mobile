import { StyleSheet, View } from 'react-native'
import { useCardSliderContext } from '@home/contexts'
import { useUserContext } from '@/contexts'

interface DotProps {
  selected: boolean
  key: number
}

const Dot = ({ selected }: DotProps) => {
  return <View style={[styles.dot, selected && styles.dotSelected]} />
}

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
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  // 고른 칸은 길쭉한 밝은 점
  dotSelected: {
    width: 14,
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
})
