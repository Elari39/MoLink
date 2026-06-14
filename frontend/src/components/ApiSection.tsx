import { useState } from 'react'
import { useI18n } from '../hooks/useI18n'
import { IconCheck, IconCopy } from './icons'

type CodePanelProps = {
  title: string
  method: string
  path: string
  description: string
  code: string
  copyLabel: string
  copiedLabel: string
  copyFailedLabel: string
}

function CodePanel({
  title,
  method,
  path,
  description,
  code,
  copyLabel,
  copiedLabel,
  copyFailedLabel,
}: CodePanelProps) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const copyStatusText = copyState === 'copied'
    ? copiedLabel
    : copyState === 'failed'
      ? copyFailedLabel
      : ''

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopyState('copied')
      window.setTimeout(() => setCopyState('idle'), 1600)
    } catch {
      setCopyState('failed')
      window.setTimeout(() => setCopyState('idle'), 2200)
    }
  }

  return (
    <article className="rounded-[22px] border border-card-border bg-card/75 p-5 shadow-[0_18px_48px_rgba(28,26,23,0.08)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-brush text-2xl font-bold text-ink">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2 rounded-full border border-card-border bg-paper/70 px-3 py-1.5 text-xs font-semibold text-ink">
          <span className="text-seal">{method}</span>
          <span>{path}</span>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-ink text-paper dark:bg-[#080d13]">
        <div className="flex items-center justify-between border-b border-paper/10 px-4 py-3">
          <span className="text-xs text-paper/60">JSON</span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs text-paper/70 transition-colors hover:text-paper"
          >
            {copyState === 'copied' ? <IconCheck className="h-3.5 w-3.5 text-seal" /> : <IconCopy className="h-3.5 w-3.5" />}
            {copyState === 'copied' ? copiedLabel : copyState === 'failed' ? copyFailedLabel : copyLabel}
          </button>
        </div>
        <pre className="ink-code-scroll overflow-x-auto p-4 text-left text-xs leading-6 text-paper/80">
          <code>{code}</code>
        </pre>
      </div>
      <span className="sr-only" aria-live="polite">{copyStatusText}</span>
    </article>
  )
}

/**
 * 静态 API 文档区块，展示当前后端已经提供的创建与统计接口。
 */
export function ApiSection() {
  const { t } = useI18n()

  const createCode = `POST /api/links
{
  "originalUrl": "https://www.example.com/page",
  "customCode": "molink",
  "expireTime": "2026-12-31T23:59:59"
}

{
  "code": 0,
  "message": "success",
  "data": {
    "code": "molink",
    "shortUrl": "http://localhost:8080/molink",
    "originalUrl": "https://www.example.com/page",
    "custom": true,
    "createTime": "2026-06-14T12:00:00",
    "expireTime": "2026-12-31T23:59:59"
  }
}`

  const statsCode = `GET /api/links/molink/stats?logLimit=20
{
  "code": 0,
  "message": "success",
  "data": {
    "code": "molink",
    "shortUrl": "http://localhost:8080/molink",
    "originalUrl": "https://www.example.com/page",
    "totalClicks": 128,
    "expired": false,
    "recentLogs": []
  }
}`

  return (
    <section id="api-docs" className="relative z-10 mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div className="lg:sticky lg:top-8">
          <span className="font-brush text-lg text-seal">{t.api.eyebrow}</span>
          <h2 className="mt-3 font-brush text-4xl font-bold text-ink sm:text-5xl">{t.api.title}</h2>
          <p className="mt-4 text-sm leading-7 text-ink-soft sm:text-base">{t.api.subtitle}</p>
          <div className="mt-6 rounded-2xl border border-card-border bg-card/70 p-4 text-sm leading-7 text-muted backdrop-blur">
            {t.api.note}
          </div>
        </div>

        <div className="grid gap-5">
          <CodePanel
            title={t.api.create.title}
            method="POST"
            path="/api/links"
            description={t.api.create.desc}
            code={createCode}
            copyLabel={t.api.copy}
            copiedLabel={t.api.copied}
            copyFailedLabel={t.api.copyFailed}
          />
          <CodePanel
            title={t.api.stats.title}
            method="GET"
            path="/api/links/{code}/stats"
            description={t.api.stats.desc}
            code={statsCode}
            copyLabel={t.api.copy}
            copiedLabel={t.api.copied}
            copyFailedLabel={t.api.copyFailed}
          />
        </div>
      </div>
    </section>
  )
}
