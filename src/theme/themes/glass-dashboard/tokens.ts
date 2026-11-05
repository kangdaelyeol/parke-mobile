import { StyleSheet } from 'react-native'
import { PRETENDARD } from '@/theme/fonts'

/**
 * 첫 번째 테마 「글래스 대시보드」 토큰 (design/dashboard.mp4에서 배경만 빼고 옮김)
 * - 판(surface): 옅은 흰 채움 + 위에서 아래로 옅어지는 광택. 옆·아래 테두리는 흐리고 위쪽만 밝다
 * - 파인 영역(inset): 판 안의 입력칸·세그먼트 바탕. 판보다 어둡다
 * - 선택된 알약(active): 세그먼트·탭·메뉴에서 고른 칸. 판보다 밝다
 * - 입력칸(field): 검은 배경 위에 바로 놓이는 떠 있는 유리 입력칸
 */
export const GLASS = {
  fill: 'rgba(255,255,255,0.05)',
  fillActive: 'rgba(255,255,255,0.09)',
  border: 'rgba(255,255,255,0.08)',
  borderActive: 'rgba(255,255,255,0.28)',
  highlight: 'rgba(255,255,255,0.18)',
  sheen:
    'linear-gradient(180deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0) 60%)',
  insetFill: 'rgba(0,0,0,0.32)',
  insetBorder: 'rgba(255,255,255,0.06)',
  activeFill: 'rgba(255,255,255,0.1)',
  activeBorder: 'rgba(255,255,255,0.12)',
  activeHighlight: 'rgba(255,255,255,0.24)',
  pressed: 'rgba(255,255,255,0.06)',
  divider: 'rgba(255,255,255,0.06)',
  glow: '0px 0px 14px rgba(255,255,255,0.08)',
  // 판 안에 한 겹 더 놓이는 타일 (영상의 Telecom Provider Health 줄)
  tileFill: 'rgba(255,255,255,0.035)',
  tileBorder: 'rgba(255,255,255,0.06)',
  // 표 안의 작은 버튼 바탕 (영상의 Reset 2FA · Logs)
  miniFill: 'rgba(255,255,255,0.07)',
} as const

// 글자 밝기 단계 (영상 기준보다 한 단계씩 밝게: 값 흰색 / 항목 이름 white/72 / 설명 white/52)
export const TEXT = {
  primary: '#ffffff',
  strong: 'rgba(255,255,255,0.9)',
  secondary: 'rgba(255,255,255,0.72)',
  tertiary: 'rgba(255,255,255,0.52)',
  faint: 'rgba(255,255,255,0.36)',
} as const

// '#RRGGBB' → 'rgba(r,g,b,alpha)'
export const withAlpha = (hex: string, alpha: number) => {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16))
  return `rgba(${r},${g},${b},${alpha})`
}

// 상태 색. 알약·아이콘 타일은 이 색을 옅게 깔고 테두리를 한 번 더 두른다
export const TONE = {
  accent: '#e4492f',
  success: '#34d399',
  info: '#38bdf8',
  warning: '#fbbf24',
  danger: '#f87171',
  violet: '#a78bfa',
  neutral: '#a1a1aa',
} as const

export type Tone = keyof typeof TONE

export interface ToneColors {
  color: string
  fill: string
  border: string
  glow: string
}

// 렌더할 때마다 색 문자열을 만들지 않도록 미리 계산해 둔다
export const toneColors = (hex: string): ToneColors => ({
  color: hex,
  fill: withAlpha(hex, 0.12),
  border: withAlpha(hex, 0.26),
  glow: `0px 0px 6px ${withAlpha(hex, 0.8)}`,
})

export const TONE_COLORS = Object.fromEntries(
  Object.entries(TONE).map(([tone, hex]) => [tone, toneColors(hex)]),
) as Record<Tone, ToneColors>

// 링크 글자 (영상의 Hardware Token (FIDO2), Target < 50ms)
export const LINK = '#5ab4e0'

// 차트 선 색 (영상: 첫 번째 하늘색, 두 번째 분홍 점선)
export const CHART = {
  primary: '#38bdf8',
  secondary: '#f43f5e',
  axis: 'rgba(255,255,255,0.32)',
  track: 'rgba(255,255,255,0.05)',
} as const

// 코드 패널 (영상 아래의 jsx 창)
export const CODE = {
  background: '#050c11',
  border: 'rgba(255,255,255,0.08)',
  lineNumber: '#434852',
  guide: 'rgba(255,255,255,0.06)',
  text: '#cbd6e2',
  keyword: '#d39bcb',
  identifier: '#4fb3d9',
  attribute: '#6ec3d2',
  string: '#98e7bc',
  punctuation: '#b3b7c0',
  // 창 왼쪽 위 신호등 점
  dots: ['#fe524a', '#fdd131', '#00d336'],
} as const

// 기본 버튼: 왼쪽이 더 붉고 오른쪽으로 갈수록 살짝 주황빛. 위쪽에 광택
export const ACCENT_FILL =
  'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 55%), linear-gradient(90deg, #e5452e 0%, #d75b43 100%)'
// 로고·아바타 타일: 왼쪽 위가 밝다
export const ACCENT_TILE = 'linear-gradient(160deg, #f0644a 0%, #c9402a 100%)'
export const ACCENT_GLOW = '0px 6px 18px rgba(228,73,47,0.35)'

export const glassStyles = StyleSheet.create({
  // 판: 카드·목록·패널
  surface: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: GLASS.border,
    borderTopColor: GLASS.highlight,
    backgroundColor: GLASS.fill,
    experimental_backgroundImage: GLASS.sheen,
  },
  // 판 안의 파인 영역: 입력칸·세그먼트 바탕
  inset: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GLASS.insetBorder,
    backgroundColor: GLASS.insetFill,
  },
  insetFocused: {
    borderColor: 'rgba(255,255,255,0.2)',
  },
  // 선택된 알약
  active: {
    borderWidth: 1,
    borderColor: GLASS.activeBorder,
    borderTopColor: GLASS.activeHighlight,
    backgroundColor: GLASS.activeFill,
  },
  // 검은 배경 위 입력칸·선택 목록
  field: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: GLASS.border,
    borderTopColor: GLASS.highlight,
    backgroundColor: GLASS.fill,
  },
  fieldFocused: {
    borderColor: GLASS.borderActive,
    backgroundColor: GLASS.fillActive,
    boxShadow: GLASS.glow,
  },
  pressed: {
    backgroundColor: GLASS.pressed,
  },
  // 판 안의 타일
  tile: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GLASS.tileBorder,
    backgroundColor: GLASS.tileFill,
  },
})

// 글자 단계
export const glassText = StyleSheet.create({
  // 묶음 이름 (영상의 MENU, SYSTEM)
  sectionLabel: {
    color: TEXT.tertiary,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 12,
    letterSpacing: 1.2,
  },
  // 카드 제목
  title: {
    color: TEXT.strong,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 15,
  },
  // 카드 부제·설명
  subtitle: {
    color: TEXT.tertiary,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 12,
  },
  // 항목 이름 (통계 카드 제목, 입력칸 이름)
  label: {
    color: TEXT.secondary,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 13,
  },
  // 큰 숫자
  value: {
    color: TEXT.primary,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 24,
    letterSpacing: -0.4,
  },
  caption: {
    color: TEXT.tertiary,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 11.5,
  },
})
