import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { messages, type Locale } from '../i18n'
import { I18nContext } from './i18nContext'

const STORAGE_KEY = 'molink-locale'

/**
 * 读取初始语言：优先 localStorage，其次根据浏览器语言判断中英，默认中文。
 */
function getInitialLocale(): Locale {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'zh' || saved === 'en') {
    return saved
  }
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

/**
 * 国际化 Provider：维护当前语言，持久化到 localStorage，并提供文案字典 t。
 */
export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale)
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = useCallback((next: Locale) => setLocaleState(next), [])
  const toggleLocale = useCallback(
    () => setLocaleState((prev) => (prev === 'zh' ? 'en' : 'zh')),
    [],
  )

  const value = useMemo(
    () => ({ locale, setLocale, toggleLocale, t: messages[locale] }),
    [locale, setLocale, toggleLocale],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
