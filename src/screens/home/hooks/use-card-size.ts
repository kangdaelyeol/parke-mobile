import { useWindowDimensions } from 'react-native'
import {
  CARD_HEIGHT,
  CARD_WIDTH,
  GLASS_CONTENT_MAX_WIDTH,
} from '@home/constants'
import { useThemeId } from '@/theme/themed'

// 홈 카드 크기 (슬라이더 칸 하나).
// - 기본 테마: 처음 크기 그대로 (330 x 210)
// - 글래스: 위의 오늘의 현황 판과 같은 폭. 높이는 처음 비율을 그대로 따른다
export const useCardSize = () => {
  const { width } = useWindowDimensions()
  const isGlass = useThemeId() === 'glass-dashboard'
  if (!isGlass) return { width: CARD_WIDTH, height: CARD_HEIGHT }

  // 홈 본문 폭(작은 화면 330, 큰 화면 400) 안에서 판 최대 폭까지
  const contentWidth = Math.min(width, width < 400 ? 330 : 400)
  const cardWidth = Math.min(contentWidth, GLASS_CONTENT_MAX_WIDTH)
  return {
    width: cardWidth,
    height: Math.round((CARD_HEIGHT * cardWidth) / CARD_WIDTH),
  }
}
