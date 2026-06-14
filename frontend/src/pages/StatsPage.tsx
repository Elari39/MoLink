import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ApiError } from '../api/client'
import { getStats } from '../api/links'
import type { LinkStatsResponse } from '../api/types'
import { IconCheck, IconCopy, IconLink, IconSearch, IconTracking } from '../components/icons'
import { useI18n } from '../hooks/useI18n'

function cleanCode(value: string) {
  return value.trim().replace(/[^A-Za-z0-9]/g, '')
}

/** 短链统计查询页。 */
export function StatsPage() {
  const { code } = useParams()
  const navigate = useNavigate()
  const { locale, t } = useI18n()
  const [query, setQuery] = useState(code ?? '')
  const [stats, setStats] = useState<LinkStatsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const copyStatusText = copyState === 'copied'
    ? t.stats.copied
    : copyState === 'failed'
      ? t.stats.copyFailed
      : ''

  const formatDateTime = useCallback(
    (value: string | null) => {
      if (!value) {
        return t.stats.neverExpire
      }
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) {
        return value
      }
      return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date)
    },
    [locale, t.stats.neverExpire],
  )

  const loadStats = useCallback(
    async (targetCode: string) => {
      setLoading(true)
      setError(null)
      setStats(null)
      try {
        const result = await getStats(targetCode, 20)
        setStats(result)
      } catch (err) {
        if (err instanceof ApiError && err.message) {
          setError(err.message)
        } else {
          setError(t.stats.errorFallback)
        }
      } finally {
        setLoading(false)
      }
    },
    [t.stats.errorFallback],
  )

  useEffect(() => {
    const routeCode = cleanCode(code ?? '')
    setQuery(routeCode)
    setCopyState('idle')
    if (!routeCode) {
      setStats(null)
      setError(null)
      setLoading(false)
      return
    }
    void loadStats(routeCode)
  }, [code, loadStats])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const targetCode = cleanCode(query)
    if (!targetCode) {
      navigate('/stats')
      setStats(null)
      setError(null)
      return
    }
    navigate(`/stats/${encodeURIComponent(targetCode)}`)
  }

  const handleCopy = async () => {
    if (!stats) return
    try {
      await navigator.clipboard.writeText(stats.shortUrl)
      setCopyState('copied')
      window.setTimeout(() => setCopyState('idle'), 1600)
    } catch {
      setCopyState('failed')
      window.setTimeout(() => setCopyState('idle'), 2200)
    }
  }

  return (
    <section className="relative z-10 mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="font-brush text-lg text-seal">{t.stats.eyebrow}</span>
        <h1 className="mt-3 font-brush text-4xl font-bold text-ink sm:text-5xl">{t.stats.title}</h1>
        <p className="mt-4 text-sm leading-7 text-ink-soft sm:text-base">{t.stats.subtitle}</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-9 flex w-full max-w-3xl flex-col gap-3 rounded-2xl border border-card-border bg-card/75 p-3 shadow-[0_18px_48px_rgba(28,26,23,0.08)] backdrop-blur-xl sm:flex-row sm:items-center sm:pl-5"
      >
        <IconSearch className="hidden h-5 w-5 shrink-0 text-muted sm:block" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(cleanCode(e.target.value))}
          placeholder={t.stats.searchPlaceholder}
          className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-ink outline-none placeholder:text-muted sm:px-0 sm:text-base"
          autoComplete="off"
          spellCheck={false}
        />
        <button
          type="submit"
          disabled={loading}
          className="ink-brush-button inline-flex min-h-12 items-center justify-center gap-2 px-8 py-3 font-semibold text-paper transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-80 dark:text-paper"
        >
          {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-paper/40 border-t-paper" />}
          {loading ? t.stats.loading : t.stats.search}
        </button>
      </form>

      {!code && !stats && !loading && !error && (
        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-card-border bg-card/65 p-6 text-center backdrop-blur-xl">
          <div className="ink-wash-disc mx-auto flex h-14 w-14 items-center justify-center rounded-full text-ink">
            <IconTracking className="h-6 w-6" />
          </div>
          <h2 className="mt-4 font-brush text-2xl font-bold text-ink">{t.stats.emptyTitle}</h2>
          <p className="mt-2 text-sm leading-7 text-muted">{t.stats.emptyDesc}</p>
        </div>
      )}

      {error && (
        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-card-border bg-card/75 p-6 text-center backdrop-blur-xl" role="alert">
          <h2 className="font-brush text-2xl font-bold text-seal">{t.stats.errorTitle}</h2>
          <p className="mt-2 text-sm leading-7 text-muted">{error}</p>
        </div>
      )}

      {loading && (
        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-card-border bg-card/75 p-6 text-center backdrop-blur-xl" aria-live="polite">
          <div className="ink-wash-disc mx-auto flex h-14 w-14 items-center justify-center rounded-full text-ink">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-ink/20 border-t-ink" />
          </div>
          <h2 className="mt-4 font-brush text-2xl font-bold text-ink">{t.stats.loadingTitle}</h2>
          <p className="mt-2 text-sm leading-7 text-muted">{t.stats.loadingDesc}</p>
        </div>
      )}

      {stats && (
        <div className="mt-10 grid gap-5">
          <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            <article className="rounded-[22px] border border-card-border bg-card/75 p-6 shadow-[0_18px_48px_rgba(28,26,23,0.08)] backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-muted">{t.stats.totalClicks}</div>
                  <div className="mt-2 font-brush text-6xl font-bold text-ink">{stats.totalClicks}</div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs ${stats.expired ? 'bg-seal/10 text-seal' : 'bg-paper/70 text-ink'}`}>
                  {stats.expired ? t.stats.expired : t.stats.active}
                </span>
              </div>
              <div className="mt-6 grid gap-3 text-sm">
                <div className="flex items-center gap-2 text-ink-soft">
                  <IconLink className="h-4 w-4 shrink-0" />
                  <a href={stats.shortUrl} target="_blank" rel="noreferrer" className="min-w-0 truncate hover:text-seal">
                    {stats.shortUrl}
                  </a>
                </div>
                <div className="text-muted">{t.stats.code}: <span className="text-ink">{stats.code}</span></div>
                <div className="text-muted">{t.stats.createdAt}: <span className="text-ink">{formatDateTime(stats.createTime)}</span></div>
                <div className="text-muted">{t.stats.expireTime}: <span className="text-ink">{formatDateTime(stats.expireTime)}</span></div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-card-border bg-paper/70 px-3 py-2 text-sm text-ink-soft transition-colors hover:text-ink dark:bg-paper-soft/70"
                >
                  {copyState === 'copied' ? <IconCheck className="h-4 w-4 text-seal" /> : <IconCopy className="h-4 w-4" />}
                  <span>{copyState === 'copied' ? t.stats.copied : copyState === 'failed' ? t.stats.copyFailed : t.stats.copy}</span>
                </button>
                <span className="sr-only" aria-live="polite">{copyStatusText}</span>
                <Link
                  to="/"
                  className="inline-flex items-center rounded-xl border border-card-border bg-paper/70 px-3 py-2 text-sm text-ink-soft transition-colors hover:text-ink dark:bg-paper-soft/70"
                >
                  {t.notFound.backHome}
                </Link>
              </div>
            </article>

            <article className="rounded-[22px] border border-card-border bg-card/75 p-6 shadow-[0_18px_48px_rgba(28,26,23,0.08)] backdrop-blur-xl">
              <h2 className="font-brush text-2xl font-bold text-ink">{t.stats.originalUrl}</h2>
              <a
                href={stats.originalUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 block break-all text-sm leading-7 text-ink-soft transition-colors hover:text-seal"
              >
                {stats.originalUrl}
              </a>
            </article>
          </div>

          <article className="rounded-[22px] border border-card-border bg-card/75 p-6 shadow-[0_18px_48px_rgba(28,26,23,0.08)] backdrop-blur-xl">
            <h2 className="font-brush text-2xl font-bold text-ink">{t.stats.recentLogs}</h2>
            {stats.recentLogs.length > 0 ? (
              <>
                <div className="mt-5 grid gap-3 md:hidden">
                  {stats.recentLogs.map((log) => {
                    const referer = log.referer?.trim() || t.stats.direct
                    const userAgent = log.userAgent?.trim() || t.stats.unknown
                    return (
                      <article
                        key={`${log.ip}-${log.accessTime}-${userAgent}`}
                        className="rounded-2xl border border-line bg-paper/55 p-4 text-sm text-ink-soft dark:bg-paper-soft/55"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-xs text-muted">{t.stats.ip}</div>
                            <div className="mt-1 font-medium text-ink">{log.ip}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-muted">{t.stats.accessTime}</div>
                            <div className="mt-1 text-ink-soft">{formatDateTime(log.accessTime)}</div>
                          </div>
                        </div>
                        <div className="mt-4 grid gap-3">
                          <div>
                            <div className="text-xs text-muted">{t.stats.referer}</div>
                            <div className="mt-1 break-all">{referer}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted">{t.stats.userAgent}</div>
                            <div className="mt-1 break-all">{userAgent}</div>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>

                <div className="ink-code-scroll mt-5 hidden overflow-x-auto md:block">
                  <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm">
                    <thead className="text-xs text-muted">
                      <tr>
                        <th className="px-3 py-2 font-medium">{t.stats.ip}</th>
                        <th className="px-3 py-2 font-medium">{t.stats.referer}</th>
                        <th className="px-3 py-2 font-medium">{t.stats.userAgent}</th>
                        <th className="px-3 py-2 font-medium">{t.stats.accessTime}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentLogs.map((log) => {
                        const referer = log.referer?.trim() || t.stats.direct
                        const userAgent = log.userAgent?.trim() || t.stats.unknown
                        return (
                          <tr key={`${log.ip}-${log.accessTime}-${userAgent}`} className="bg-paper/55 text-ink-soft dark:bg-paper-soft/55">
                            <td className="rounded-l-xl px-3 py-3 whitespace-nowrap">{log.ip}</td>
                            <td className="max-w-[220px] truncate px-3 py-3" title={referer}>
                              {referer}
                            </td>
                            <td className="max-w-[320px] truncate px-3 py-3" title={userAgent}>{userAgent}</td>
                            <td className="rounded-r-xl px-3 py-3 whitespace-nowrap">{formatDateTime(log.accessTime)}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="mt-5 rounded-2xl border border-line bg-paper/50 p-5 text-sm text-muted dark:bg-paper-soft/50">
                {t.stats.noLogs}
              </div>
            )}
          </article>
        </div>
      )}
    </section>
  )
}
