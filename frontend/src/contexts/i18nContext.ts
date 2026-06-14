import { createContext } from 'react'
import type { Locale, Messages } from '../i18n'

/** 国际化上下文值 */
export interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
  /** 当前语言对应的文案字典 */
  t: Messages
}

/** 国际化上下文。Provider 见 I18nProvider.tsx，消费见 hooks/useI18n.ts */
export const I18nContext = createContext<I18nContextValue | null>(null)
