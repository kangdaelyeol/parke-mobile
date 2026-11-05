import { useWindowDimensions } from 'react-native'

// 화면 배치 기준값 (두 테마 공통)

// 이보다 좁으면 작은 화면으로 보고 여백·글자·탭바를 줄인다
export const SMALL_SCREEN_WIDTH = 400
// 본문 최대 폭. 큰 화면·태블릿에서도 본문은 이보다 넓어지지 않고 가운데에 놓인다
export const CONTENT_MAX_WIDTH = 400

export const useIsSmallScreen = () =>
  useWindowDimensions().width < SMALL_SCREEN_WIDTH
