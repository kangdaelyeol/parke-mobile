import { useWindowDimensions } from 'react-native'
import {
  CARD_HEIGHT,
  CARD_WIDTH,
  GLASS_CONTENT_MAX_WIDTH,
} from '@home/constants'
import { useThemed } from '@/theme/themed'
import type { ThemeId } from '@/theme/themes'
import { CONTENT_MAX_WIDTH, SMALL_SCREEN_WIDTH } from '@/theme/layout'

type CardSize = { width: number; height: number }

// 테마별 홈 카드 크기 (화면 폭 → 슬라이더 칸 하나)
const CARD_SIZE: Record<ThemeId, (screenWidth: number) => CardSize> = {
  // 기본 테마: 처음 크기 그대로 (330 x 210)
  classic: () => ({ width: CARD_WIDTH, height: CARD_HEIGHT }),
  // 글래스: 위의 오늘의 현황 판과 같은 폭. 높이는 처음 비율을 그대로 따른다
  'glass-dashboard': screenWidth => {
    // 홈 본문 폭(작은 화면 330, 큰 화면 400) 안에서 판 최대 폭까지
    const contentWidth = Math.min(
      screenWidth,
      screenWidth < SMALL_SCREEN_WIDTH ? 330 : CONTENT_MAX_WIDTH,
    )
    const width = Math.min(contentWidth, GLASS_CONTENT_MAX_WIDTH)
    return { width, height: Math.round((CARD_HEIGHT * width) / CARD_WIDTH) }
  },
}

// 홈 카드 크기 (슬라이더 칸 하나)
export const useCardSize = () => {
  const { width } = useWindowDimensions()
  return useThemed(CARD_SIZE)(width)
}
