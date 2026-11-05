import { StyleSheet, View } from 'react-native'
import { useCardSliderContext } from '@home/contexts'
import { useUserContext } from '@/contexts'
import { DARK_LIGHT, GRAY } from '@/theme/color'
import { useThemed } from '@/theme/themed'

interface DotProps {
  selected: boolean
  key: number
}

const dotStyles = StyleSheet.create({
  classicDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: DARK_LIGHT,
  },
  classicSelected: {
    backgroundColor: GRAY,
  },
  glassDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  glassSelected: {
    width: 14,
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
})

// 테마별 점 모양. 기본 테마: 같은 크기 회색 점 / 글래스: 고른 칸만 길쭉한 밝은 점
const DOTS = {
  classic: { dot: dotStyles.classicDot, selected: dotStyles.classicSelected },
  'glass-dashboard': {
    dot: dotStyles.glassDot,
    selected: dotStyles.glassSelected,
  },
}

const Dot = ({ selected }: DotProps) => {
  const dots = useThemed(DOTS)
  return <View style={[dots.dot, selected && dots.selected]} />
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
})
