import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useI18n } from '../hooks/useI18n'
import { IconClose, IconMenu, LogoMark } from './icons'
import { LangToggle } from './LangToggle'
import { ThemeToggle } from './ThemeToggle'

/**
 * 顶部导航：左侧品牌标识，中间页面路由，右侧主题与语言切换。
 */
export function Navbar() {
  const { t } = useI18n()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { key: 'home', label: t.nav.home, to: '/' },
    { key: 'features', label: t.nav.features, to: '/features' },
    { key: 'api', label: t.nav.api, to: '/api-docs' },
    { key: 'stats', label: t.nav.stats, to: '/stats' },
    { key: 'about', label: t.nav.about, to: '/about' },
  ]

  const linkClass = (isActive: boolean) =>
    `text-sm font-medium transition-colors hover:text-ink ${
      isActive ? 'border-b-2 border-ink pb-1 text-ink' : 'text-ink-soft'
    }`

  return (
    <header className="relative z-20 mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-5 sm:px-5 md:grid-cols-[1fr_auto_1fr] md:px-8">
      {/* 品牌 */}
      <Link to="/" className="flex min-w-0 items-center gap-2 text-ink sm:gap-3" onClick={() => setMobileOpen(false)}>
        <LogoMark className="h-10 w-10 shrink-0 drop-shadow-sm sm:h-11 sm:w-11" />
        <span className="flex flex-col leading-none">
          <span className="font-brush text-2xl font-bold">{t.brand.name}</span>
          <span className="mt-1 text-sm font-medium tracking-wide text-ink-soft">MoLink</span>
        </span>
      </Link>

      {/* 页面路由（中等屏幕以上显示） */}
      <nav className="hidden items-center gap-6 rounded-full px-5 py-2 md:flex">
        {navItems.map((item) => (
          <NavLink
            key={item.key}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => linkClass(isActive)}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* 右侧操作区 */}
      <div className="flex items-center justify-end gap-2 sm:gap-3">
        <ThemeToggle />
        <LangToggle />
        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? t.nav.closeMenu : t.nav.openMenu}
          onClick={() => setMobileOpen((open) => !open)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-card-border bg-card/75 text-ink-soft shadow-sm backdrop-blur-xl transition-colors hover:text-ink md:hidden"
        >
          {mobileOpen ? <IconClose className="h-4 w-4" /> : <IconMenu className="h-4 w-4" />}
        </button>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-nav"
          className="col-span-2 grid gap-1 rounded-2xl border border-card-border bg-card/85 p-2 shadow-[0_18px_48px_rgba(28,26,23,0.1)] backdrop-blur-xl md:hidden"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-paper/75 text-ink dark:bg-paper-soft/75'
                    : 'text-ink-soft hover:bg-paper/50 hover:text-ink dark:hover:bg-paper-soft/50'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
