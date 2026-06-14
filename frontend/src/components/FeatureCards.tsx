import type { ComponentType, SVGProps } from 'react'
import { useI18n } from '../hooks/useI18n'
import { IconCustom, IconEasy, IconSafe, IconTracking } from './icons'

type Feature = {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  title: string
  desc1: string
  desc2: string
}

/**
 * 四个特性：以紧凑横向条目承接首屏表单，图标使用墨晕圆章。
 */
export function FeatureCards() {
  const { t } = useI18n()

  const features: Feature[] = [
    { icon: IconEasy, title: t.features.easy.title, desc1: t.features.easy.desc1, desc2: t.features.easy.desc2 },
    { icon: IconTracking, title: t.features.tracking.title, desc1: t.features.tracking.desc1, desc2: t.features.tracking.desc2 },
    { icon: IconSafe, title: t.features.safe.title, desc1: t.features.safe.desc1, desc2: t.features.safe.desc2 },
    { icon: IconCustom, title: t.features.custom.title, desc1: t.features.custom.desc1, desc2: t.features.custom.desc2 },
  ]

  return (
    <section
      id="features"
      className="relative z-10 mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-2xl text-center">
        <span className="font-brush text-lg text-seal">{t.features.eyebrow}</span>
        <h2 className="mt-3 font-brush text-4xl font-bold text-ink sm:text-5xl">{t.features.title}</h2>
        <p className="mt-4 text-sm leading-7 text-ink-soft sm:text-base">{t.features.subtitle}</p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, desc1, desc2 }) => (
          <div key={title} className="flex items-center gap-4 rounded-2xl px-2 py-2 text-left">
            <div className="ink-wash-disc flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-ink shadow-sm">
              <Icon className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <h3 className="font-brush text-lg font-bold text-ink">{title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted sm:text-[13px]">
                {desc1}
                <br />
                {desc2}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
