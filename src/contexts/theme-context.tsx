import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { cacheService } from '@/services'
import { AppTheme, findTheme, ThemeId, THEMES } from '@/theme/themes'

interface ThemeContextValue {
  // 지금 쓰는 테마
  theme: AppTheme
  // 설정에서 고를 수 있는 테마
  themes: AppTheme[]
  // 테마를 고르고 기기에 저장한다
  selectTheme: (id: ThemeId) => void
}

const themeContext = createContext({} as ThemeContextValue)

// 고른 테마를 기기에 저장하고 앱 전체에 알려준다
export const ThemeContextProvider = ({ children }: PropsWithChildren) => {
  const [themeId, setThemeId] = useState<ThemeId>(
    () => findTheme(cacheService.getThemeId()).id,
  )

  const selectTheme = useCallback((id: ThemeId) => {
    cacheService.setThemeId(id)
    setThemeId(id)
  }, [])

  const value = useMemo(
    () => ({ theme: findTheme(themeId), themes: THEMES, selectTheme }),
    [themeId, selectTheme],
  )

  return <themeContext.Provider value={value}>{children}</themeContext.Provider>
}

export const useAppTheme = () => useContext(themeContext)
