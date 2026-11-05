import { useMemo, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { ThemeGalleryStackNavigationProp } from '@/navigation/types'
import { findTheme, ThemeId } from '@/theme/themes'
import { CHALLENGES, ChallengeFilter } from '../sample-data'
import {
  ChartTabKey,
  RangeKey,
  ThemeGalleryViewModel,
  WaveRangeKey,
} from '../types'

// 구성 요소 보기: 영상 대시보드의 조작(메뉴·기간·탭·필터·입력)을 실제로 눌러 볼 수 있게 상태만 둔다
export const useThemeGalleryViewModel = (
  themeId: ThemeId,
): ThemeGalleryViewModel => {
  const navigation = useNavigation<ThemeGalleryStackNavigationProp>()
  const [nav, setNav] = useState('overview')
  const [search, setSearch] = useState('')
  const [range, setRange] = useState<RangeKey>('30d')
  const [chartTab, setChartTab] = useState<ChartTabKey>('revenue')
  const [filter, setFilter] = useState<ChallengeFilter>('all')
  const [waveRange, setWaveRange] = useState<WaveRangeKey>('24h')
  const [phone, setPhone] = useState('+1 (555) 382-9012')

  const challenges = useMemo(
    () =>
      filter === 'all'
        ? CHALLENGES
        : CHALLENGES.filter(row => row.status.filter === filter),
    [filter],
  )

  return {
    state: {
      theme: findTheme(themeId),
      nav,
      search,
      range,
      chartTab,
      filter,
      challenges,
      waveRange,
      phone,
    },
    actions: {
      backPress: () => navigation.goBack(),
      navPress: setNav,
      searchInput: setSearch,
      rangeChange: setRange,
      chartTabChange: setChartTab,
      filterChange: setFilter,
      waveRangeChange: setWaveRange,
      phoneInput: setPhone,
    },
  }
}
