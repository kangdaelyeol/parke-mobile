import { themed } from '@/theme/themed'
import { ClassicChangelogScreen } from './changelog-screen.classic'
import { GlassChangelogScreen } from './changelog-screen.glass'

// 버전별 변경 내역. 고른 테마의 모양으로 그린다
const ChangelogScreen = themed({
  classic: ClassicChangelogScreen,
  'glass-dashboard': GlassChangelogScreen,
})

export default ChangelogScreen
