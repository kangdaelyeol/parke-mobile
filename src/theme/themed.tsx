import { ComponentType } from 'react'
import { useAppTheme } from '@/contexts/theme-context'
import { ThemeId } from '@/theme/themes'

// 지금 고른 테마 이름
export const useThemeId = (): ThemeId => useAppTheme().theme.id

// 지금 테마에 맞는 값을 고른다 (스타일 묶음, 색 등). 테마가 늘면 빠진 값을 타입 검사가 알려준다
export const useThemed = <T,>(variants: Record<ThemeId, T>): T =>
  variants[useThemeId()]

// 테마마다 모양이 다른 컴포넌트. 지금 테마의 것을 그린다
export const themed = <P extends object>(
  variants: Record<ThemeId, ComponentType<P>>,
) => {
  const Themed = (props: P) => {
    const Component = variants[useThemeId()]
    return <Component {...props} />
  }
  return Themed
}

// 이름이 같은 스타일 묶음을 테마별로 고른다 (이름은 T 기준, 값만 테마마다 다르다).
// 어느 테마 묶음에 이름이 빠지면 타입 검사가 알려준다
export const useThemedSheet = <T extends object>(
  sheets: Record<ThemeId, { [K in keyof T]: unknown }>,
): T => sheets[useThemeId()] as T
