/**
 * 水墨印章装饰：朱红方印，内嵌一个汉字。用于标题旁与页脚点缀。
 */
export function InkSeal({
  char = '链',
  className = '',
  size = 32,
}: {
  char?: string
  className?: string
  size?: number
}) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-[6px] bg-seal font-brush leading-none text-white shadow-sm ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.56 }}
      aria-hidden="true"
    >
      {char}
    </span>
  )
}
