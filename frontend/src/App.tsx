import { Route, Routes } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { InkBackdrop } from './components/InkBackdrop'
import { AboutPage } from './pages/AboutPage'
import { ApiDocsPage } from './pages/ApiDocsPage'
import { FeaturesPage } from './pages/FeaturesPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { StatsPage } from './pages/StatsPage'

/**
 * 墨链 MoLink 前端应用。
 *
 * 公共水墨背景、导航与页脚常驻，中间区域由 React Router 渲染页面。
 * 主题与语言由外层 Provider（见 main.tsx）提供。
 */
function App() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      {/* 全屏水墨背景，置于内容之下 */}
      <InkBackdrop />

      <Navbar />

      <main className="relative z-10 flex flex-1 flex-col">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/api-docs" element={<ApiDocsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/stats/:code" element={<StatsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App
