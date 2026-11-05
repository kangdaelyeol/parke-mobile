import { themed } from '@/theme/themed'
import { ClassicToggle } from './toggle.classic'
import { GlassToggle } from './toggle.glass'

// 켜고 끄는 스위치. 고른 테마의 모양을 그린다
export const Toggle = themed({
  classic: ClassicToggle,
  'glass-dashboard': GlassToggle,
})
