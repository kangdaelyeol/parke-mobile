import { glassDashboardTheme } from './glass-dashboard/theme'
import { AppTheme, ThemeId } from './types'

export * from './types'

// 설정에서 고를 수 있는 테마 (먼저 나오는 것이 기본)
export const THEMES: AppTheme[] = [glassDashboardTheme]

export const DEFAULT_THEME_ID: ThemeId = glassDashboardTheme.id

// 저장된 이름이 없거나 사라진 테마면 기본 테마
export const findTheme = (id?: string | null): AppTheme =>
  THEMES.find(theme => theme.id === id) ?? THEMES[0]
