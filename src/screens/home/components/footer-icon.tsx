import { themed } from '@/theme/themed'
import { ClassicFooterIcon } from './footer-icon.classic'
import { GlassFooterIcon } from './footer-icon.glass'

// 탭바 한 칸. 고른 테마의 모양으로 그린다
export const FooterIcon = themed({
  classic: ClassicFooterIcon,
  'glass-dashboard': GlassFooterIcon,
})
