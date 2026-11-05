import { ComponentType } from 'react'

// 테마 이름 (테마가 늘면 여기에 더한다)
export type ThemeId = 'classic' | 'glass-dashboard'

// 테마 하나: 설정에 보이는 정보 + 미리보기
export interface AppTheme {
  id: ThemeId
  name: string
  description: string
  // 따라 만든 디자인 (영상 파일·이전 버전)
  source: string
  // 설정의 테마 카드에 그리는 작은 미리보기
  Preview: ComponentType
  // 강조색 (설정에서 고른 테마 카드 테두리)
  accent: string
  // 테마에 담긴 컴포넌트 전체를 보는 화면이 있는지
  hasGallery: boolean
}
