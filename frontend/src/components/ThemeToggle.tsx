import { useTheme } from '../hooks/useTheme'
import { IconMoon, IconSun } from './icons'

/**
 * 主题切换开关：胶囊形滑块，左日右月，点击在明/暗之间切换。
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? '切换到明亮主题' : '切换到暗色主题'}
      className="relative inline-flex h-9 w-[72px] items-center rounded-full border border-card-border bg-card/75 px-1 shadow-sm backdrop-blur-xl transition-colors dark:bg-card/60"
    >
      {/* 左右图标 */}
      <span className="flex w-full items-center justify-between px-1.5 text-muted">
        <IconSun className="h-4 w-4" />
        <IconMoon className="h-4 w-4" />
      </span>
      {/* 滑块 */}
      <span
        className={`absolute top-1 h-7 w-7 rounded-full bg-ink shadow-md transition-transform duration-300 ${
          isDark ? 'translate-x-[36px]' : 'translate-x-0'
        }`}
      >
        <span className="flex h-full w-full items-center justify-center text-paper">
          {isDark ? <IconMoon className="h-4 w-4" /> : <IconSun className="h-4 w-4" />}
        </span>
      </span>
    </button>
  )
}
