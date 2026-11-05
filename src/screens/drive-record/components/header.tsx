import { themed } from '@/theme/themed'
import { ClassicHeader } from './header.classic'
import { GlassHeader } from './header.glass'

export const Header = themed({
  classic: ClassicHeader,
  'glass-dashboard': GlassHeader,
})
