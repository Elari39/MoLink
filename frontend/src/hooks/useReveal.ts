import { useEffect, useRef, useState } from 'react'

interface RevealOptions {
  /** 元素可见比例阈值，默认 0.15 */
  threshold?: number
  /** 提前触发的根边距，例如 '0px 0px -10% 0px' */
  rootMargin?: string
  /** 仅触发一次（默认 true），离开后不再重置 */
  once?: boolean
}

/**
 * 滚动揭示：基于 IntersectionObserver 的轻量 hook。
 *
 * 元素进入视口时返回 isIntersecting=true，配合 .reveal / .is-visible
 * 实现上浮淡入。SSR/不支持 IntersectionObserver 时直接视为可见。
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.15,
  rootMargin = '0px 0px -10% 0px',
  once = true,
}: RevealOptions = {}) {
  const ref = useRef<T | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // 不支持 IntersectionObserver 时直接显示，避免内容永久不可见
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true)
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            setIsVisible(false)
          }
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return { ref, isVisible }
}
