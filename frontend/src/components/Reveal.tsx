import type { CSSProperties, ElementType, ReactNode } from 'react'
import { useReveal } from '../hooks/useReveal'

interface RevealProps {
  children: ReactNode
  /** 入场延迟（毫秒），用于错峰入场（stagger） */
  delay?: number
  /** 渲染的标签，默认 div */
  as?: ElementType
  className?: string
  style?: CSSProperties
  /** 仅触发一次，默认 true */
  once?: boolean
}

/**
 * 滚动揭示包裹组件：子节点进入视口时上浮淡入。
 *
 * 用法：
 * <Reveal delay={80}><FeatureCard /></Reveal>
 *
 * 内部依赖 .reveal / .is-visible 工具类（见 index.css）。
 * 尊重 prefers-reduced-motion：媒体查询下 .reveal 不再隐藏内容。
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className = '',
  style,
  once = true,
}: RevealProps) {
  const { ref, isVisible } = useReveal<HTMLDivElement>({ once })

  return (
    <Tag
      ref={ref}
      className={`reveal ${isVisible ? 'is-visible' : ''} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </Tag>
  )
}
