import { zh, type Messages } from './zh'
import { en } from './en'

/** 支持的语言代码 */
export type Locale = 'zh' | 'en'

/** 语言 → 文案字典映射 */
export const messages: Record<Locale, Messages> = { zh, en }

export type { Messages }
