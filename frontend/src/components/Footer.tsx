import { useI18n } from '../hooks/useI18n'
import { InkBrushDivider } from './InkBrushDivider'
import { InkSeal } from './InkSeal'

/**
 * 页脚：个人项目归属 + 站点/GitHub 链接 + 印章点缀。
 * 顶部以一条更克制的笔触分隔线收束页面节奏。
 */
export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="relative z-10 mx-auto w-full max-w-6xl px-6 py-10">
      <InkBrushDivider className="mb-8" opacity={0.22} strokeWidth={10} />
      <div className="flex flex-col items-center justify-center gap-3 text-center text-sm text-muted sm:flex-row sm:flex-wrap">
        <span>{t.footer.copyright}</span>
        <a
          href={t.footer.siteUrl}
          target="_blank"
          rel="noreferrer"
          className="transition-colors hover:text-ink"
        >
          {t.footer.siteLabel}
        </a>
        <a
          href={t.footer.profileUrl}
          target="_blank"
          rel="noreferrer"
          className="transition-colors hover:text-ink"
        >
          {t.footer.profileLabel}
        </a>
        <a
          href={t.footer.repoUrl}
          target="_blank"
          rel="noreferrer"
          className="transition-colors hover:text-ink"
        >
          {t.footer.repoLabel}
        </a>
        <InkSeal char="印" size={22} />
      </div>
    </footer>
  )
}
