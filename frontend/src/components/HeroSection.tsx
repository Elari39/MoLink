import { useI18n } from '../hooks/useI18n'
import { InkSeal } from './InkSeal'
import { ShortenForm } from './ShortenForm'

/**
 * 主视觉区：书法标题 + 印章 + 副标题 + 缩短链接表单。
 *
 * 三段错峰入场（标题→副标题→表单），形成"墨笔落纸"的呼吸。
 */
export function HeroSection() {
  const { t } = useI18n()

  return (
    <section id="home" className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-5 pb-10 pt-10 text-center sm:px-6 sm:pt-16 lg:pt-20">
      {/* 书法标题，行尾缀朱红印章 */}
      <h1
        className="animate-rise relative inline-flex max-w-full items-start justify-center text-balance font-brush text-5xl font-bold leading-tight text-ink drop-shadow-sm sm:text-6xl md:text-7xl"
        style={{ animationDelay: '0ms' }}
      >
        {t.hero.title}
        <InkSeal char="墨" size={28} className="animate-pulse ml-2 mt-2 sm:mt-3" />
      </h1>

      <p
        className="animate-rise mx-auto mt-5 max-w-2xl text-base text-ink-soft sm:text-xl"
        style={{ animationDelay: '120ms' }}
      >
        {t.hero.subtitle}
      </p>

      {/* 缩短链接表单 */}
      <div
        className="animate-rise mt-9 w-full sm:mt-10"
        style={{ animationDelay: '240ms' }}
      >
        <ShortenForm />
      </div>
    </section>
  )
}
