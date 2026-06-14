import { useContext } from 'react'
import { I18nContext } from '../contexts/i18nContext'

/**
 * 访问国际化上下文。必须在 I18nProvider 内使用。
 */
export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useI18n 必须在 I18nProvider 内部使用')
  }
  return ctx
}
