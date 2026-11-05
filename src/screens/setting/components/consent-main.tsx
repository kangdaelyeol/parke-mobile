import { themed } from '@/theme/themed'
import { ClassicConsentMain } from './consent-main.classic'
import { GlassConsentMain } from './consent-main.glass'

export const ConsentMain = themed({
  classic: ClassicConsentMain,
  'glass-dashboard': GlassConsentMain,
})
