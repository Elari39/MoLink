import { useState, type FormEvent } from 'react'
import { createLink } from '../api/links'
import { ApiError } from '../api/client'
import type { LinkResponse } from '../api/types'
import { useI18n } from '../hooks/useI18n'
import { IconChevronDown } from './icons'
import { ResultCard } from './ResultCard'

const CUSTOM_CODE_MIN_LENGTH = 4
const CUSTOM_CODE_MAX_LENGTH = 16
const CUSTOM_CODE_PATTERN = /^[A-Za-z0-9]+$/

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value)
    return (url.protocol === 'http:' || url.protocol === 'https:') && Boolean(url.hostname)
  } catch {
    return false
  }
}

function isFutureDateTime(value: string) {
  const time = new Date(value).getTime()
  return Number.isFinite(time) && time > Date.now()
}

/**
 * 缩短链接表单：核心交互区。
 *
 * 完整覆盖三态：
 * - Loading：提交中按钮显示 spinner 并禁用。
 * - Error：前端 URL 校验失败 / 后端返回错误时展示提示。
 * - Empty：未生成结果时 ResultCard 展示占位文案。
 *
 * 额外提供「自定义短码」可展开输入（对应自定义短码功能）。
 */
export function ShortenForm() {
  const { t } = useI18n()

  const [url, setUrl] = useState('')
  const [customCode, setCustomCode] = useState('')
  const [expireTime, setExpireTime] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<LinkResponse | null>(null)
  const customCodeHasError = error === t.errors.invalidCustomCode || error === t.errors.customCodeLength

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    const trimmed = url.trim()
    const trimmedCustomCode = customCode.trim()
    if (!trimmed) {
      setError(t.errors.empty)
      return
    }
    if (!isValidHttpUrl(trimmed)) {
      setError(t.errors.invalidUrl)
      return
    }
    if (trimmedCustomCode && !CUSTOM_CODE_PATTERN.test(trimmedCustomCode)) {
      setError(t.errors.invalidCustomCode)
      return
    }
    if (
      trimmedCustomCode
      && (trimmedCustomCode.length < CUSTOM_CODE_MIN_LENGTH
        || trimmedCustomCode.length > CUSTOM_CODE_MAX_LENGTH)
    ) {
      setError(t.errors.customCodeLength)
      return
    }
    if (expireTime && !isFutureDateTime(expireTime)) {
      setError(t.errors.expireTimePast)
      return
    }

    setLoading(true)
    try {
      const result = await createLink({
        originalUrl: trimmed,
        customCode: trimmedCustomCode || undefined,
        expireTime: expireTime || undefined,
      })
      setResult(result)
    } catch (err) {
      // 后端业务错误（如短码冲突、参数非法）直接展示其 message，其余用兜底文案
      if (err instanceof ApiError && err.code > 0 && err.message) {
        setError(err.message)
      } else {
        setError(t.errors.requestFailed)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl rounded-[24px] border border-card-border bg-card/75 p-4 shadow-[0_24px_70px_rgba(28,26,23,0.12)] backdrop-blur-xl dark:shadow-[0_24px_80px_rgba(0,0,0,0.32)] sm:p-6">
      <form onSubmit={handleSubmit}>
        {/* 输入 + 提交 */}
        <div className="ink-focus-ring flex flex-col gap-3 rounded-2xl border border-card-border bg-paper/70 p-2 shadow-inner shadow-white/30 dark:bg-paper-soft/70 dark:shadow-black/20 sm:flex-row sm:items-center sm:pl-5">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t.form.placeholder}
            className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-ink outline-none placeholder:text-muted sm:px-0 sm:text-base"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="submit"
            disabled={loading}
            className="ink-brush-button inline-flex min-h-12 items-center justify-center gap-2 px-8 py-3 font-semibold text-paper transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-80 dark:text-paper"
          >
            {loading && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-paper/40 border-t-paper" />
            )}
            {loading ? t.form.submitting : t.form.submit}
          </button>
        </div>

        {/* 自定义短码（可展开） */}
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="mt-4 inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm text-muted transition-colors hover:text-ink-soft"
        >
          <IconChevronDown
            className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
          />
          {t.form.advanced}
        </button>
        {showAdvanced && (
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              placeholder={t.form.customPlaceholder}
              className="w-full rounded-xl border border-card-border bg-paper/70 px-4 py-2.5 text-ink outline-none placeholder:text-muted dark:bg-paper-soft/70"
              maxLength={CUSTOM_CODE_MAX_LENGTH}
              aria-invalid={customCodeHasError}
              autoComplete="off"
              spellCheck={false}
            />
            <label className="grid gap-1">
              <span className="px-1 text-xs text-muted">{t.form.expireTime}</span>
              <input
                type="datetime-local"
                value={expireTime}
                onChange={(e) => setExpireTime(e.target.value)}
                className="w-full rounded-xl border border-card-border bg-paper/70 px-4 py-2.5 text-ink outline-none placeholder:text-muted dark:bg-paper-soft/70"
              />
            </label>
          </div>
        )}
        {showAdvanced && <p className="mt-2 px-1 text-xs leading-5 text-muted">{t.form.customHint}</p>}

        {/* 错误提示 */}
        {error && (
          <p className="mt-3 text-sm text-seal" role="alert">
            {error}
          </p>
        )}
      </form>

      {/* 结果区 */}
      <div className="mt-4">
        <ResultCard result={result} />
      </div>
    </div>
  )
}
