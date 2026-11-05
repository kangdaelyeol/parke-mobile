import { useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// 화면 아래에 떠 있는 유리 탭바의 높이와 화면 아래(홈 인디케이터 포함)에서 띄우는 거리.
// 탭 화면들은 space만큼 아래를 비워 두어야 내용이 탭바에 가리지 않는다
export const useTabBarLayout = () => {
  const { width } = useWindowDimensions()
  const { bottom: safeBottom } = useSafeAreaInsets()
  const height = width < 400 ? 54 : 62
  const bottom = Math.max(12, safeBottom - 10)
  return { height, bottom, space: height + bottom }
}
