import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useThemed } from '@/theme/themed'
import type { ThemeId } from '@/theme/themes'
import { useIsSmallScreen } from '@/theme/layout'

interface TabBarLayout {
  height: number
  // 화면 아래에서 띄우는 거리
  bottom: number
  // 탭 화면이 아래에 비워 둘 높이
  space: number
}

// 테마별 아래 탭바 배치 (작은 화면인지, 홈 인디케이터 높이 → 배치)
const TAB_BAR: Record<
  ThemeId,
  (isSmall: boolean, safeBottom: number) => TabBarLayout
> = {
  // 기본 테마: 화면 아래에 붙은 바 (처음 푸터 높이)
  classic: isSmall => {
    const height = isSmall ? 60 : 90
    return { height, bottom: 0, space: height }
  },
  // 글래스: 홈 인디케이터 위에 떠 있는 유리 탭바
  'glass-dashboard': (isSmall, safeBottom) => {
    const height = isSmall ? 54 : 62
    const bottom = Math.max(12, safeBottom - 10)
    return { height, bottom, space: height + bottom }
  },
}

// 아래 탭바의 높이와 화면 아래에서 띄우는 거리. 탭 화면들은 space만큼 아래를 비워 둔다
export const useTabBarLayout = () => {
  const isSmall = useIsSmallScreen()
  const { bottom } = useSafeAreaInsets()
  return useThemed(TAB_BAR)(isSmall, bottom)
}
