import { useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useThemeId } from '@/theme/themed'

// 아래 탭바의 높이와 화면 아래에서 띄우는 거리. 탭 화면들은 space만큼 아래를 비워 둔다
// - 기본 테마: 화면 아래에 붙은 바 (처음 푸터 높이)
// - 글래스: 홈 인디케이터 위에 떠 있는 유리 탭바
export const useTabBarLayout = () => {
  const { width } = useWindowDimensions()
  const { bottom: safeBottom } = useSafeAreaInsets()
  const isGlass = useThemeId() === 'glass-dashboard'
  const isSmall = width < 400

  if (!isGlass) {
    const height = isSmall ? 60 : 90
    return { height, bottom: 0, space: height }
  }
  const height = isSmall ? 54 : 62
  const bottom = Math.max(12, safeBottom - 10)
  return { height, bottom, space: height + bottom }
}
