import type { ApiResult } from './types'

/** API 基础路径。开发期经 Vite 代理、生产经 nginx 反代到后端 */
const BASE_URL = '/api'

/**
 * 业务错误：携带后端返回的 message 与业务 code，便于上层区分提示。
 */
export class ApiError extends Error {
  readonly code: number

  constructor(code: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.code = code
  }
}

/**
 * 统一的请求封装：自动序列化 JSON、解析 ApiResult、抛出 ApiError。
 *
 * @param path   相对 /api 的路径
 * @param options fetch 配置
 * @returns 业务数据 data
 */
export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
      ...options,
    })
  } catch {
    // 网络层错误（断网、跨域、后端未启动等）
    throw new ApiError(-1, 'network error')
  }

  // 解析响应体（即便是错误响应，后端也返回 ApiResult 结构）
  let body: ApiResult<T>
  try {
    body = (await response.json()) as ApiResult<T>
  } catch {
    throw new ApiError(response.status, `unexpected response (${response.status})`)
  }

  if (!response.ok || body.code !== 0) {
    throw new ApiError(body.code ?? response.status, body.message ?? 'request failed')
  }
  return body.data as T
}
