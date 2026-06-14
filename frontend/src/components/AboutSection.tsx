import { useI18n } from '../hooks/useI18n'
import { InkSeal } from './InkSeal'

/**
 * 关于我们：补齐品牌叙事与技术可信度。
 */
export function AboutSection() {
  const { t } = useI18n()

  return (
    <section id="about" className="relative z-10 mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <span className="font-brush text-lg text-seal">{t.about.eyebrow}</span>
          <h2 className="mt-3 font-brush text-4xl font-bold leading-tight text-ink sm:text-5xl">
            {t.about.title}
            <InkSeal char="链" size={26} className="ml-2 align-middle" />
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-ink-soft sm:text-base">{t.about.subtitle}</p>
        </div>

        <div className="rounded-[24px] border border-card-border bg-card/75 p-5 shadow-[0_18px_48px_rgba(28,26,23,0.08)] backdrop-blur-xl sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {t.about.points.map((point) => (
              <div key={point.title} className="rounded-2xl border border-line bg-paper/50 p-4 dark:bg-paper-soft/50">
                <div className="font-brush text-xl font-bold text-ink">{point.title}</div>
                <p className="mt-2 text-sm leading-6 text-muted">{point.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {t.about.metrics.map((metric) => (
          <div key={metric.label} className="flex items-center gap-4 rounded-2xl border border-card-border bg-card/60 p-4 backdrop-blur">
            <span className="ink-wash-disc flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-brush text-lg font-bold text-ink">
              {metric.mark}
            </span>
            <div>
              <div className="font-semibold text-ink">{metric.label}</div>
              <p className="mt-1 text-sm text-muted">{metric.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
