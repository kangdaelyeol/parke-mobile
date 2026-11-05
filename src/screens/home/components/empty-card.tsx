import { themed } from '@/theme/themed'
import { ClassicEmptyCard } from './empty-card.classic'
import { GlassEmptyCard } from './empty-card.glass'

export const EmptyCard = themed({
  classic: ClassicEmptyCard,
  'glass-dashboard': GlassEmptyCard,
})
