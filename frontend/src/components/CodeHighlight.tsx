import { useMemo } from 'react'

/**
 * 零依赖的轻量 HTTP / JSON 语法高亮。
 *
 * 输入是 ApiSection 里的代码字符串，形如：
 *   POST /api/links
 *   { "originalUrl": "...", ... }
 *   { "code": 0, "data": { ... } }
 *
 * 解析为 token 后渲染为带颜色的 <span>，配色由 index.css 的
 * .tok-* 类（代码面板墨黑底专用配色）提供。复制功能在调用方仍复制
 * 原始纯文本，本组件只负责显示。
 */
type TokenType =
  | 'method'
  | 'path'
  | 'key'
  | 'string'
  | 'number'
  | 'bool'
  | 'punct'
  | 'text'

interface Token {
  type: TokenType
  value: string
}

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'] as const

const CLASS_MAP: Record<TokenType, string> = {
  method: 'tok-method',
  path: 'tok-path',
  key: 'tok-key',
  string: 'tok-string',
  number: 'tok-number',
  bool: 'tok-bool',
  punct: 'tok-punct',
  text: 'tok-text',
}

function tokenize(input: string): Token[] {
  const tokens: Token[] = []
  const n = input.length
  let i = 0
  let atLineStart = true

  while (i < n) {
    const ch = input[i]

    // 行首：识别 HTTP 方法行（METHOD 空格 路径）
    if (atLineStart) {
      const method = HTTP_METHODS.find((m) => input.startsWith(m, i) && input[i + m.length] === ' ')
      if (method) {
        tokens.push({ type: 'method', value: method })
        i += method.length

        // 消耗方法与路径之间的空格
        let spaces = ''
        while (i < n && (input[i] === ' ' || input[i] === '\t')) {
          spaces += input[i]
          i++
        }
        if (spaces) tokens.push({ type: 'text', value: spaces })

        // 消耗路径到行尾
        let pth = ''
        while (i < n && input[i] !== '\n') {
          pth += input[i]
          i++
        }
        if (pth) tokens.push({ type: 'path', value: pth })

        atLineStart = false
        continue
      }
    }

    // 换行
    if (ch === '\n') {
      tokens.push({ type: 'text', value: '\n' })
      i++
      atLineStart = true
      continue
    }

    // 字符串：根据其后是否紧跟 ':' 区分 key 与普通字符串值
    if (ch === '"') {
      let j = i + 1
      let str = '"'
      while (j < n) {
        if (input[j] === '\\') {
          // 转义字符原样保留
          str += input[j] + (input[j + 1] ?? '')
          j += 2
          continue
        }
        str += input[j]
        if (input[j] === '"') {
          j++
          break
        }
        j++
      }
      // 向后跳过空白，判断是否为键
      let k = j
      while (k < n && (input[k] === ' ' || input[k] === '\t')) k++
      const isKey = input[k] === ':'
      tokens.push({ type: isKey ? 'key' : 'string', value: str })
      i = j
      atLineStart = false
      continue
    }

    // 数字（含负号开头）
    if (/[0-9]/.test(ch) || (ch === '-' && /[0-9]/.test(input[i + 1] ?? ''))) {
      let j = i
      let num = ''
      while (j < n && /[0-9.eE+\-]/.test(input[j])) {
        num += input[j]
        j++
      }
      tokens.push({ type: 'number', value: num })
      i = j
      atLineStart = false
      continue
    }

    // 布尔 / null
    const literal = (['true', 'false', 'null'] as const).find((w) => input.startsWith(w, i))
    if (literal) {
      tokens.push({ type: 'bool', value: literal })
      i += literal.length
      atLineStart = false
      continue
    }

    // JSON 标点
    if ('{}[]:,'.includes(ch)) {
      tokens.push({ type: 'punct', value: ch })
      i++
      atLineStart = false
      continue
    }

    // 其余字符（空格、普通文本）逐字符保留，保持 <pre> 原始排版
    tokens.push({ type: 'text', value: ch })
    i++
    atLineStart = false
  }

  return tokens
}

interface CodeHighlightProps {
  code: string
  className?: string
}

export function CodeHighlight({ code, className = '' }: CodeHighlightProps) {
  const tokens = useMemo(() => tokenize(code), [code])

  return (
    <code className={className}>
      {tokens.map((tok, idx) => (
        <span key={idx} className={CLASS_MAP[tok.type]}>
          {tok.value}
        </span>
      ))}
    </code>
  )
}
