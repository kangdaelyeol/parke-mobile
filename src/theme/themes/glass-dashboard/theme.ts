import { AppTheme } from '../types'
import {
  ACCENT_FILL,
  ACCENT_GLOW,
  ACCENT_TILE,
  CHART,
  CODE,
  GLASS,
  LINK,
  TEXT,
  TONE,
} from './tokens'

// 첫 번째 테마: design/dashboard.mp4의 유리 대시보드를 배경만 빼고 옮겼다
export const glassDashboardTheme: AppTheme = {
  id: 'glass-dashboard',
  name: '글래스 대시보드',
  description: '어두운 유리 판, 위쪽만 밝은 테두리, 주황빛 강조색',
  source: 'design/dashboard.mp4',
  preview: {
    accent: TONE.accent,
    tones: [TONE.success, TONE.info, TONE.warning, TONE.violet],
  },
  tokens: {
    glass: GLASS,
    text: TEXT,
    tone: TONE,
    accent: { fill: ACCENT_FILL, tile: ACCENT_TILE, glow: ACCENT_GLOW },
    link: LINK,
    chart: CHART,
    code: CODE,
  },
}
