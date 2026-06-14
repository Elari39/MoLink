import { HeroSection } from '../components/HeroSection'
import { InkBrushDivider } from '../components/InkBrushDivider'

/** 首页：保留核心短链生成体验。 */
export function HomePage() {
  return (
    <>
      <HeroSection />
      <InkBrushDivider className="mt-6 sm:mt-10" />
    </>
  )
}
