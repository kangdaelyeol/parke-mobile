import { ComponentType } from 'react'
import { useAppTheme } from '@/contexts/theme-context'
import { ThemeId } from '@/theme/themes'

/**
 * 테마마다 달라지는 것은 아래 세 가지로만 고른다. 모두 Record<ThemeId, …>를 받으므로
 * 테마를 하나 더하면 값을 빠뜨린 곳을 타입 검사가 알려준다.
 * - 구조가 다른 컴포넌트: themed({ classic, 'glass-dashboard' })  (파일은 *.classic.tsx / *.glass.tsx)
 * - 모양만 다른 컴포넌트: useThemedSheet({ classic, 'glass-dashboard' })  (같은 이름의 스타일 묶음)
 * - 값·배치 수치: useThemed({ classic, 'glass-dashboard' })
 * 테마 이름을 직접 비교하면(=== 'glass-dashboard') 새 테마에서 조용히 다른 테마처럼 동작하므로
 * 테마 이름은 이 파일 밖으로 내보내지 않는다
 */

// 지금 고른 테마 이름
const useThemeId = (): ThemeId => useAppTheme().theme.id

// 지금 테마에 맞는 값을 고른다 (스타일 묶음, 색, 배치 계산 함수 등)
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
  // 개발 도구에서 어떤 컴포넌트인지 보이게 (예: Themed(ClassicToggle | GlassToggle))
  Themed.displayName = `Themed(${Object.values(variants)
    .map(variant => variant.displayName ?? variant.name)
    .join(' | ')})`
  return Themed
}

// 이름이 같은 스타일 묶음을 테마별로 고른다 (이름은 T 기준, 값만 테마마다 다르다).
// 어느 테마 묶음에 이름이 빠지면 타입 검사가 알려준다
export const useThemedSheet = <T extends object>(
  sheets: Record<ThemeId, { [K in keyof T]: unknown }>,
): T => sheets[useThemeId()] as T
