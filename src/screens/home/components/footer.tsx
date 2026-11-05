import { themed } from '@/theme/themed'
import { ClassicFooter } from './footer.classic'
import { GlassFooter } from './footer.glass'

// 아래 탭바. 고른 테마의 모양으로 그린다 (동작은 useFooterViewModel 하나)
export const Footer = themed({
  classic: ClassicFooter,
  'glass-dashboard': GlassFooter,
})
