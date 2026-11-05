import { themed } from '@/theme/themed'
import { ClassicMain } from './main.classic'
import { GlassMain } from './main.glass'

export const Main = themed({
  classic: ClassicMain,
  'glass-dashboard': GlassMain,
})
