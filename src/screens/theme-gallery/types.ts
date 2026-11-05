import { AppTheme } from '@/theme/themes'
import { ViewModel } from '@/types/common'
import {
  CHALLENGES,
  CHART_TABS,
  ChallengeFilter,
  RANGES,
  WAVE_RANGES,
} from './sample-data'

export type RangeKey = (typeof RANGES)[number]['key']
export type ChartTabKey = (typeof CHART_TABS)[number]['key']
export type WaveRangeKey = (typeof WAVE_RANGES)[number]['key']

interface ThemeGalleryState {
  theme: AppTheme
  // 사이드바에서 고른 메뉴
  nav: string
  search: string
  range: RangeKey
  chartTab: ChartTabKey
  filter: ChallengeFilter
  // 필터에 맞는 표 줄
  challenges: typeof CHALLENGES
  waveRange: WaveRangeKey
  phone: string
}

interface ThemeGalleryActions {
  backPress: () => void
  navPress: (key: string) => void
  searchInput: (v: string) => void
  rangeChange: (key: RangeKey) => void
  chartTabChange: (key: ChartTabKey) => void
  filterChange: (key: ChallengeFilter) => void
  waveRangeChange: (key: WaveRangeKey) => void
  phoneInput: (v: string) => void
}

export type ThemeGalleryViewModel = ViewModel<
  ThemeGalleryState,
  ThemeGalleryActions
>
