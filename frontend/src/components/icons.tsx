import type { SVGProps } from 'react'

/**
 * 一组无填充、跟随 currentColor 的线性图标，统一 24x24 viewBox。
 * 通过传入 className 控制尺寸与颜色。
 */

type IconProps = SVGProps<SVGSVGElement>

const base = (props: IconProps) => ({
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...props,
})

/** 链接 */
export function IconLink(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M10 13a5 5 0 0 0 7.07 0l3-3A5 5 0 0 0 13 3l-1.5 1.5" />
      <path d="M14 11a5 5 0 0 0-7.07 0l-3 3A5 5 0 0 0 11 21l1.5-1.5" />
    </svg>
  )
}

/** 复制 */
export function IconCopy(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  )
}

/** 对勾 */
export function IconCheck(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m20 6-11 11-5-5" />
    </svg>
  )
}

/** 太阳 */
export function IconSun(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

/** 月亮 */
export function IconMoon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  )
}

/** 语言切换 */
export function IconLanguages(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 5h7" />
      <path d="M7.5 3v2" />
      <path d="M9.5 5c-.8 2.8-2.7 5.2-5.5 7" />
      <path d="M5.5 8.5c1.1 1.7 2.7 3 4.8 3.8" />
      <path d="M13 19l4-10 4 10" />
      <path d="M14.4 15.5h5.2" />
    </svg>
  )
}

/** 向下箭头（展开） */
export function IconChevronDown(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

/** 菜单 */
export function IconMenu(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  )
}

/** 关闭 */
export function IconClose(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  )
}

/** 简单易用：光标点击 */
export function IconEasy(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 3l7 17 2.5-6.5L19 11 3 3Z" />
    </svg>
  )
}

/** 数据追踪：柱状图 */
export function IconTracking(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 21h18" />
      <rect x="5" y="11" width="3.2" height="7" rx="0.6" />
      <rect x="10.4" y="6" width="3.2" height="12" rx="0.6" />
      <rect x="15.8" y="9" width="3.2" height="9" rx="0.6" />
    </svg>
  )
}

/** 外部打开 */
export function IconExternalLink(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M14 4h6v6" />
      <path d="m10 14 10-10" />
      <path d="M20 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4" />
    </svg>
  )
}

/** 搜索 */
export function IconSearch(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

/** 安全可靠：盾牌 */
export function IconSafe(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

/** 自定义：铅笔 */
export function IconCustom(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </svg>
  )
}

/**
 * 墨链 Logo：太极（阴阳）图，象征链接的往复与平衡。
 * 黑区取 currentColor（随主题墨色），白区以 mask 镂空透出背景，
 * 鱼眼按太极阴阳反色，从而在任意背景下均无色差。
 */
export function LogoMark(props: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" {...props}>
      <defs>
        <mask id="logo-taiji">
          <rect width="64" height="64" fill="white" />
          {/* 白色半区 → 镂空（透出背景） */}
          <path d="M32,2 A30,30 0 0,1 32,62 A15,15 0 0,1 32,32 A15,15 0 0,0 32,2 Z" fill="black" />
          {/* 黑区里的白鱼眼 → 镂空 */}
          <circle cx="32" cy="17" r="5" fill="black" />
        </mask>
      </defs>
      {/* 黑底整圆（currentColor），mask 镂出白区与白鱼眼 */}
      <circle cx="32" cy="32" r="30" fill="currentColor" mask="url(#logo-taiji)" />
      {/* 白区里的黑鱼眼（currentColor，独立于 mask） */}
      <circle cx="32" cy="47" r="5" fill="currentColor" />
    </svg>
  )
}
