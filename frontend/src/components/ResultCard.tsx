import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { LinkResponse } from '../api/types'
import { useI18n } from '../hooks/useI18n'
import { IconCheck, IconCopy, IconExternalLink, IconLink, IconTracking } from './icons'

function formatDateTime(value: string | null, emptyLabel: string) {
  if (!value) {
    return emptyLabel
  }
  return value.replace('T', ' ').slice(0, 16)
}

/**
 * 短链结果展示卡片。
 *
 * - 未生成（value 为空）：展示占位提示（Empty State）。
 * - 已生成：展示完整短链、短码、过期时间、复制按钮与统计入口。
 */
export function ResultCard({ result }: { result: LinkResponse | null }) {
  const { t } = useI18n()
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const shortUrl = result?.shortUrl ?? null
  const copyStatusText = copyState === 'copied'
    ? t.form.copied
    : copyState === 'failed'
      ? t.form.copyFailed
      : ''

  const handleCopy = async () => {
    if (!shortUrl) return
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopyState('copied')
      window.setTimeout(() => setCopyState('idle'), 1800)
    } catch {
      setCopyState('failed')
      window.setTimeout(() => setCopyState('idle'), 2200)
    }
  }

  return (
    <div
      className={`rounded-2xl border bg-paper/60 px-4 py-3.5 shadow-inner shadow-white/20 backdrop-blur transition-all duration-300 ease-out dark:bg-paper-soft/70 dark:shadow-black/20 sm:px-5 sm:py-4 ${
        result
          ? 'border-card-border hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--ink)_22%,transparent)] hover:shadow-[0_10px_30px_-10px_rgba(28,26,23,0.18)]'
          : 'border-card-border'
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="ink-wash-disc flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink">
            <IconLink className="h-4 w-4" />
          </span>

          {result ? (
            <div className="min-w-0 flex-1 text-left">
              <a
                href={result.shortUrl}
                target="_blank"
                rel="noreferrer"
                className="block truncate text-sm text-ink transition-colors hover:text-seal sm:text-base"
                title={result.shortUrl}
              >
                {result.shortUrl}
              </a>
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
                <span>{t.form.shortCode}: {result.code}</span>
                <span>{t.form.expireTime}: {formatDateTime(result.expireTime, t.form.noExpire)}</span>
              </div>
            </div>
          ) : (
            <span className="min-w-0 flex-1 truncate text-left text-sm text-muted sm:text-base">{t.form.resultPlaceholder}</span>
          )}
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 pl-11 sm:pl-0">
          {result && (
            <>
              <a
                href={result.shortUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-card-border bg-card/70 px-3 py-2 text-sm text-ink-soft transition-colors hover:text-ink"
              >
                <IconExternalLink className="h-4 w-4" />
                <span>{t.form.openLink}</span>
              </a>
              <Link
                to={`/stats/${encodeURIComponent(result.code)}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-card-border bg-card/70 px-3 py-2 text-sm text-ink-soft transition-colors hover:text-ink"
              >
                <IconTracking className="h-4 w-4" />
                <span>{t.form.viewStats}</span>
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={handleCopy}
            disabled={!shortUrl}
            className="inline-flex items-center gap-1.5 rounded-xl border border-card-border bg-card/70 px-3 py-2 text-sm text-ink-soft transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            {copyState === 'copied' ? <IconCheck className="h-4 w-4 text-seal" /> : <IconCopy className="h-4 w-4" />}
            <span>{copyState === 'copied' ? t.form.copied : copyState === 'failed' ? t.form.copyFailed : t.form.copy}</span>
          </button>
        </div>
      </div>
      <span className="sr-only" aria-live="polite">{copyStatusText}</span>
    </div>
  )
}
