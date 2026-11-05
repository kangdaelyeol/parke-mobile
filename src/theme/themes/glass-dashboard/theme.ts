import { AppTheme } from '../types'
import { GlassDashboardPreview } from './preview'
import { TONE } from './tokens'

// 글래스 대시보드: design/dashboard.mp4의 유리 대시보드를 배경만 빼고 옮겼다
export const glassDashboardTheme: AppTheme = {
  id: 'glass-dashboard',
  name: '글래스 대시보드',
  description: '어두운 유리 판, 위쪽만 밝은 테두리, 파란 강조색',
  source: 'design/dashboard.mp4',
  Preview: GlassDashboardPreview,
  accent: TONE.accent,
  hasGallery: true,
}
