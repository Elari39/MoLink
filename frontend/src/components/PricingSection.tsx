import { Link } from 'react-router-dom'
import { useI18n } from '../hooks/useI18n'

/**
 * 能力分层式定价区块：不承诺真实价格，只说明不同使用场景的能力边界。
 */
export function PricingSection() {
  const { t } = useI18n()
  const ctaTargets = ['/', '/stats', '/api-docs']

  return (
    <section id="pricing" className="relative z-10 mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="font-brush text-lg text-seal">{t.pricing.eyebrow}</span>
        <h2 className="mt-3 font-brush text-4xl font-bold text-ink sm:text-5xl">{t.pricing.title}</h2>
        <p className="mt-4 text-sm leading-7 text-ink-soft sm:text-base">{t.pricing.subtitle}</p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {t.pricing.plans.map((plan, index) => {
          const featured = index === 1
          return (
            <article
              key={plan.name}
              className={`rounded-[22px] border p-6 shadow-[0_18px_48px_rgba(28,26,23,0.08)] backdrop-blur-xl transition-transform hover:-translate-y-1 ${
                featured
                  ? 'border-ink bg-ink text-paper dark:border-ink dark:bg-ink dark:text-paper'
                  : 'border-card-border bg-card/75 text-ink'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-brush text-2xl font-bold">{plan.name}</h3>
                  <p className={`mt-2 text-sm leading-6 ${featured ? 'text-paper/70' : 'text-muted'}`}>
                    {plan.tagline}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    featured ? 'bg-paper/10 text-paper' : 'bg-paper/70 text-seal dark:bg-paper-soft/70'
                  }`}
                >
                  {plan.badge}
                </span>
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-sm leading-6">
                    <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${featured ? 'bg-paper' : 'bg-seal'}`} />
                    <span className={featured ? 'text-paper/80' : 'text-ink-soft'}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={ctaTargets[index] ?? '/'}
                className={`mt-7 inline-flex w-full items-center justify-center rounded-full border px-4 py-3 text-sm font-semibold transition-colors ${
                  featured
                    ? 'border-paper/25 bg-paper text-ink hover:bg-paper-soft'
                    : 'border-card-border bg-paper/70 text-ink hover:border-ink/30'
                }`}
              >
                {plan.cta}
              </Link>
            </article>
          )
        })}
      </div>
    </section>
  )
}
