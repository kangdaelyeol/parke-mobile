import { classicTheme } from './classic/theme'
import { glassDashboardTheme } from './glass-dashboard/theme'
import { AppTheme, ThemeId } from './types'

export * from './types'

// 설정에서 고를 수 있는 테마 (첫 번째가 기본)
export const THEMES: AppTheme[] = [classicTheme, glassDashboardTheme]

export const DEFAULT_THEME_ID: ThemeId = classicTheme.id

// 저장된 이름이 없거나 사라진 테마면 기본 테마
export const findTheme = (id?: string | null): AppTheme =>
  THEMES.find(theme => theme.id === id) ?? THEMES[0]
