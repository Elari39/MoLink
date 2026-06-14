import { useI18n } from '../hooks/useI18n'
import { InkSeal } from './InkSeal'
import { ShortenForm } from './ShortenForm'

/**
 * 主视觉区：书法标题 + 印章 + 副标题 + 缩短链接表单。
 */
export function HeroSection() {
  const { t } = useI18n()

  return (
    <section id="home" className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-5 pb-10 pt-10 text-center sm:px-6 sm:pt-16 lg:pt-20">
      {/* 书法标题，行尾缀朱红印章 */}
      <h1 className="relative inline-flex max-w-full items-start justify-center text-balance font-brush text-5xl font-bold leading-tight text-ink drop-shadow-sm sm:text-6xl md:text-7xl">
        {t.hero.title}
        <InkSeal char="墨" size={28} className="ml-2 mt-2 sm:mt-3" />
      </h1>

      <p className="mx-auto mt-5 max-w-2xl text-base text-ink-soft sm:text-xl">
        {t.hero.subtitle}
      </p>

      {/* 缩短链接表单 */}
      <div className="mt-9 w-full sm:mt-10">
        <ShortenForm />
      </div>
    </section>
  )
}
