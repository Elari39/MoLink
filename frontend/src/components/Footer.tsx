import { useI18n } from '../hooks/useI18n'
import { InkSeal } from './InkSeal'

/**
 * 页脚：版权文案 + 印章点缀。
 */
export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-center gap-3 px-6 py-10 text-sm text-muted">
      <span>{t.footer.copyright}</span>
      <InkSeal char="印" size={22} />
    </footer>
  )
}
