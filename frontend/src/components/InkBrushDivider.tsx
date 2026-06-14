import { useReveal } from '../hooks/useReveal'

interface InkBrushDividerProps {
  /** 笔触粗细，默认 14（viewBox 单位） */
  strokeWidth?: number
  /** 线条透明度 0-1，默认 0.32 */
  opacity?: number
  className?: string
}

/**
 * 水墨横笔分隔线：不规则、两端飞白的笔触形态。
 *
 * 进入视口时由左向右"画"出（stroke-dasharray 偏移过渡），
 * 颜色取 currentColor，居中自适应宽度。用于区块之间的呼吸分隔。
 */
export function InkBrushDivider({
  strokeWidth = 14,
  opacity = 0.32,
  className = '',
}: InkBrushDividerProps) {
  const { ref, isVisible } = useReveal<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={`mx-auto flex w-full max-w-xs items-center justify-center text-ink ${className}`.trim()}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 600 40"
        fill="none"
        preserveAspectRatio="none"
        className="h-5 w-full"
        style={{ opacity }}
      >
        <defs>
          <linearGradient id="ink-brush-fade" x1="0" x2="1" y1="0" y2="0">
            {/* 两端飞白，中段饱满 */}
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="8%" stopColor="currentColor" stopOpacity="0.85" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="92%" stopColor="currentColor" stopOpacity="0.85" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M24 22 C 96 14 168 26 240 19 C 320 12 400 26 480 18 C 528 13 560 22 576 19"
          stroke="url(#ink-brush-fade)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{
            strokeDasharray: 1100,
            strokeDashoffset: isVisible ? 0 : 1100,
            transition:
              'stroke-dashoffset 1.1s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      </svg>
    </div>
  )
}
