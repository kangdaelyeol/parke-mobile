import { BLUE_PRIMARY } from '@/theme/color'
import { AppTheme } from '../types'
import { ClassicPreview } from './preview'

// 기본 테마: glassy를 적용하기 전 처음 디자인 (어두운 카드, 파란 강조색)
export const classicTheme: AppTheme = {
  id: 'classic',
  name: '기본',
  description: '처음 디자인 · 어두운 카드와 파란 강조색',
  source: '처음 디자인 (glassy 적용 전)',
  Preview: ClassicPreview,
  accent: BLUE_PRIMARY,
  hasGallery: false,
}
