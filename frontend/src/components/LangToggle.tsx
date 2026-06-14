import { useI18n } from '../hooks/useI18n'
import { IconLanguages } from './icons'

/**
 * 语言切换：点击在 中文 / English 之间切换，并展示当前语言。
 */
export function LangToggle() {
  const { locale, toggleLocale } = useI18n()

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label="切换语言 / Switch language"
      className="inline-flex h-9 items-center gap-2 rounded-full border border-card-border bg-card/75 px-4 text-sm font-medium text-ink-soft shadow-sm backdrop-blur-xl transition-colors hover:text-ink dark:bg-card/60"
    >
      <span>{locale === 'zh' ? '中文' : 'English'}</span>
      <IconLanguages className="h-4 w-4" />
    </button>
  )
}
