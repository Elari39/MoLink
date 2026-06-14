import { useI18n } from '../hooks/useI18n'
import { InkSeal } from './InkSeal'
import { Reveal } from './Reveal'

/**
 * 关于我们：补齐品牌叙事与技术可信度。
 * points 与 metrics 进入视口时错峰上浮淡入，悬浮时墨晕扩散。
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
            <InkSeal char="链" size={26} className="animate-pulse ml-2 align-middle" />
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-ink-soft sm:text-base">{t.about.subtitle}</p>
        </div>

        <div className="rounded-[24px] border border-card-border bg-card/75 p-5 shadow-[0_18px_48px_rgba(28,26,23,0.08)] backdrop-blur-xl sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {t.about.points.map((point, index) => (
              <Reveal key={point.title} delay={index * 80}>
                <div className="group h-full rounded-2xl border border-line bg-paper/50 p-4 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--ink)_18%,transparent)] hover:shadow-[0_10px_26px_-12px_rgba(28,26,23,0.2)] dark:bg-paper-soft/50">
                  <div className="font-brush text-xl font-bold text-ink">{point.title}</div>
                  <p className="mt-2 text-sm leading-6 text-muted">{point.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {t.about.metrics.map((metric, index) => (
          <Reveal key={metric.label} delay={index * 100}>
            <div className="group flex h-full items-center gap-4 rounded-2xl border border-card-border bg-card/60 p-4 backdrop-blur transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--ink)_16%,transparent)] hover:bg-card/75">
              <span className="ink-wash-disc flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-brush text-lg font-bold text-ink transition-transform duration-300 group-hover:scale-[1.06]">
                {metric.mark}
              </span>
              <div>
                <div className="font-semibold text-ink">{metric.label}</div>
                <p className="mt-1 text-sm text-muted">{metric.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
