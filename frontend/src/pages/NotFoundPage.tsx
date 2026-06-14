import { Link } from 'react-router-dom'
import { useI18n } from '../hooks/useI18n'

/** 前端路由兜底页。 */
export function NotFoundPage() {
  const { t } = useI18n()

  return (
    <section className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-20 text-center sm:px-6">
      <span className="font-brush text-lg text-seal">404</span>
      <h1 className="mt-3 font-brush text-5xl font-bold text-ink">{t.notFound.title}</h1>
      <p className="mt-4 max-w-xl text-sm leading-7 text-muted sm:text-base">{t.notFound.desc}</p>
      <Link
        to="/"
        className="ink-brush-button mt-8 inline-flex min-h-12 items-center justify-center px-8 py-3 font-semibold text-paper dark:text-paper"
      >
        {t.notFound.backHome}
      </Link>
    </section>
  )
}
