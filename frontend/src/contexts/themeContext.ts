import { createContext } from 'react'

/** 主题模式 */
export type Theme = 'light' | 'dark'

/** 主题上下文值 */
export interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

/** 主题上下文。Provider 见 ThemeProvider.tsx，消费见 hooks/useTheme.ts */
export const ThemeContext = createContext<ThemeContextValue | null>(null)
