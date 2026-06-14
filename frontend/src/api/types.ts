/**
 * 与后端 DTO 对齐的前端类型定义。
 */

/** 统一响应包装，对应后端 ApiResult<T> */
export interface ApiResult<T> {
  code: number
  message: string
  data: T | null
}

/** 创建短链请求体，对应后端 CreateLinkRequest */
export interface CreateLinkRequest {
  originalUrl: string
  /** 可选自定义短码 */
  customCode?: string
  /** 可选过期时间，ISO 字符串（如 2026-12-31T23:59:59） */
  expireTime?: string
}

/** 创建短链响应，对应后端 LinkResponse */
export interface LinkResponse {
  code: string
  shortUrl: string
  originalUrl: string
  custom: boolean
  createTime: string
  expireTime: string | null
}

/** 单条访问明细 */
export interface AccessLogItem {
  ip: string
  userAgent: string | null
  referer: string | null
  accessTime: string
}

/** 短链统计响应，对应后端 LinkStatsResponse */
export interface LinkStatsResponse {
  code: string
  shortUrl: string
  originalUrl: string
  totalClicks: number
  createTime: string
  expireTime: string | null
  expired: boolean
  recentLogs: AccessLogItem[]
}
