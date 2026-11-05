import { themed } from '@/theme/themed'
import { ClassicTodaySummary } from './today-summary.classic'
import { GlassTodaySummary } from './today-summary.glass'

export const TodaySummary = themed({
  classic: ClassicTodaySummary,
  'glass-dashboard': GlassTodaySummary,
})
