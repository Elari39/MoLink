import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './contexts/ThemeProvider'
import { I18nProvider } from './contexts/I18nProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 主题与国际化 Provider 包裹全局 */}
    <ThemeProvider>
      <I18nProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </I18nProvider>
    </ThemeProvider>
  </StrictMode>,
)
