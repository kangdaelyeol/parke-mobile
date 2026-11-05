import { themed } from '@/theme/themed'
import { ClassicButton } from '@/theme/themes/classic/components/classic-button'
import { GlassButton } from '@/theme/themes/glass-dashboard/components/glass-button'

export type { GlassButtonVariant as ButtonVariant } from '@/theme/themes/glass-dashboard/components/glass-button'

// 앱 곳곳에서 쓰는 버튼. 고른 테마의 버튼을 그린다
export const PressableButton = themed({
  classic: ClassicButton,
  'glass-dashboard': GlassButton,
})
