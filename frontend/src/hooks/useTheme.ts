import { useContext } from 'react'
import { ThemeContext } from '../contexts/themeContext'

/**
 * 访问主题上下文。必须在 ThemeProvider 内使用。
 */
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme 必须在 ThemeProvider 内部使用')
  }
  return ctx
}
