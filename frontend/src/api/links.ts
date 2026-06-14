import { request } from './client'
import type { CreateLinkRequest, LinkResponse, LinkStatsResponse } from './types'

/**
 * 创建短链。
 *
 * @param payload 创建请求（原始链接 + 可选自定义短码/过期时间）
 * @returns 创建结果（含完整短链 shortUrl）
 */
export function createLink(payload: CreateLinkRequest): Promise<LinkResponse> {
  return request<LinkResponse>('/links', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/**
 * 查询短链点击统计。
 *
 * @param code     短码
 * @param logLimit 返回的最近访问明细条数
 */
export function getStats(code: string, logLimit = 20): Promise<LinkStatsResponse> {
  return request<LinkStatsResponse>(`/links/${encodeURIComponent(code)}/stats?logLimit=${logLimit}`)
}
